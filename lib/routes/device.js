const express = require('express');
const Device = require('../db/models/device');
const Measurement = require('../db/models/measurement');

const router = new express.Router();

const MAX_PAGE_SIZE = 100;

router.post('/', async (req, res) => {
  try {
    const dev = new Device({ ...req.body, owner: req.user._id });
    dev.save();
    res.status(201).send(dev);
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/', async (req, res) => {
  try {
    // we need to add pagination to this query.
    const devices = await Device.find({ owner: req.user._id }, null, { sort: { lastOnline: -1, createdAt: -1 } });
    res.send(devices);
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/:id', async (req, res) => {
  try {
    const devices = await Device.findOne({ owner: req.user._id, _id: req.params.id });
    res.send(devices);
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/:id/measurements', async (req, res) => {
  try {
    const dev = await Device.findOne({ owner: req.user._id, _id: req.params.id });
    if (!dev) {
      return res.status(404).send();
    }

    const page = parseInt(req.query.page) || 1;
    const PAGE_SIZE = Math.min(parseInt(req.query.limit) || 25, MAX_PAGE_SIZE);
    let totalReadings = [];

    let readings = {};
    if (req.query.endDate && req.query.startDate) {
      const startDate = new Date(req.query.startDate);
      const endDate = new Date(req.query.endDate);
      totalReadings = await Measurement.countDocuments({ 
        "metadata.serial": dev.serial,
        "timestamp": { $gte: startDate, $lte: endDate }
      });
      readings = await Measurement.find({ 
        "metadata.serial": dev.serial, timestamp: { $gte: startDate, $lte: endDate } })
        .limit(PAGE_SIZE)
    } else {
      totalReadings = await Measurement.countDocuments({ 
        "metadata.serial": dev.serial,
      });
      readings = await Measurement.find({
        "metadata.serial": dev.serial })
        .limit(PAGE_SIZE)
        .sort({ timestamp: -1 })
        .skip((page - 1) * PAGE_SIZE)
    }

    res.send({
      readings,
      totalPages: Math.ceil(totalReadings / PAGE_SIZE),
      currentPage: page,
      count: totalReadings
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send();
  }
});


router.get('/:id/measurements/:channel', async (req, res) => {
  try {
    const dev = await Device.findOne({ owner: req.user._id, _id: req.params.id });
    
    if (!dev) {
      return res.status(404).send();
    }

    const events = await Measurement.find({
      "metadata.serial": dev.serial, 
      "metadata.channel": parseInt(req.params.channel),
      // last 24 hours
      // timestamp: {
      //   $gte: new Date(new Date() - 24 * 60 * 60 * 1000),
      // },
    }, null, { sort: { timestamp: -1 } })
    .limit(100);
  
    
    res.send(events);
  } catch (error) {
    res.status(500).send();
  }
});

/**
 * Get latest readings from device. maybe we should call this live readings?
 */
router.get('/:id/latest', async (req, res) => {
  try {
    const dev = await Device.findOne({ owner: req.user._id, _id: req.params.id });
    if (!dev) {
      return res.status(404).send();
    }

    // get latest readings from device.
    const readings = await Measurement.find({ 
      "metadata.serial": dev.serial, 
      timestamp: { 
        $gte: new Date(new Date() - 60 * 1000) 
      }})
      .sort({ timestamp: -1 }).limit(25);

      let uniqueChannels = [];
      const filteredReadings = readings.filter((r, i) => {
        if (!uniqueChannels.includes(r.metadata.channel)) {
          uniqueChannels.push(r.metadata.channel);
          return true;
        }
      });

    res.send({ measurements: filteredReadings });

    //res.send({ measurements: readings });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const dev = await Device.findOne({ owner: req.user._id, _id: req.params.id });
    if (!dev) {
      return res.status(404).send();
    }

    if (req.body.capabilities) {
      // lets only add new capabilities
      const newCapabilities = req.body.capabilities.filter(c => !dev.capabilities.includes(c));
      dev.capabilities = [...dev.capabilities, ...newCapabilities];
    }

    if (req.body.name) {
      dev.name = req.body.name;
    }
    
    await dev.save();
    res.send(dev);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const dev = await Device.findOne({ owner: req.user._id, _id: req.params.id });
    if (!dev) {
      return res.status(404).send();
    }

    await Device.deleteOne({ owner: req.user._id, _id: req.params.id })
    res.status(204).send();

  } catch (error) {
    console.log(error);
    res.status(404).send({ok: false});
  }
});

module.exports = router;
