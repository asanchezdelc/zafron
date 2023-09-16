const express = require('express');
const Device = require('../db/models/devices');
const Telemetric = require('../db/models/telemetric');
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

router.get('/:id/readings', async (req, res) => {
  try {
    const dev = await Device.findOne({ owner: req.user._id, _id: req.params.id });
    if (!dev) {
      return res.status(404).send();
    }

    const page = parseInt(req.query.page) || 1;
    const PAGE_SIZE = Math.min(parseInt(req.query.limit) || 25, MAX_PAGE_SIZE);
    const totalReadings = await Telemetric.countDocuments({ device_id: dev.serial });

    let readings = [];

    if (req.query.endDate && req.query.startDate) {
      const startDate = new Date(req.query.startDate);
      const endDate = new Date(req.query.endDate);
      readings = await Telemetric.find({ device_id: dev.serial, timestamp: { $gte: startDate, $lte: endDate } }).limit(MAX_PAGE_SIZE)
    } else {
      readings = await Telemetric.find({ device_id: dev.serial })
        .sort({ timestamp: -1 })
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE);
    }

    res.send({
      readings,
      totalPages: Math.ceil(totalReadings / PAGE_SIZE),
      currentPage: page
    });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.get('/:id/latest', async (req, res) => {
  try {
    const dev = await Device.findOne({ owner: req.user._id, _id: req.params.id });
    if (!dev) {
      return res.status(404).send();
    }

    const readings = await Telemetric.findOne({ device_id: dev.serial }, null, { sort: { timestamp: -1 } });
    res.send(readings);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});


router.get('/:id/histogram', async (req, res) => {
  try {
    const dev = await Device.findOne({ owner: req.user._id, _id: req.params.id });
    if (!dev) {
      return res.status(404).send();
    }
    const now = new Date();
    const fifteenMinutesAgo = new Date(now - 15 * 60 * 1000);
    const pipeline = [
      {
          $match: {
              timestamp: {
                  $gte: fifteenMinutesAgo,
                  $lte: now
              },
              device_id: dev.serial
          }
      },
      {
          $group: {
              _id: {
                  year: { $year: "$timestamp" },
                  month: { $month: "$timestamp" },
                  day: { $dayOfMonth: "$timestamp" },
                  hour: { $hour: "$timestamp" },
                  minute: { $minute: "$timestamp" }
              },
              count: { $sum: 1 }
          }
      },
      {
          $sort: { "_id": 1 }
      }
    ];
    

    const readings = await Telemetric.aggregate(pipeline);

    const filledResults = [];

    for (let i = 0; i < 15; i++) {
        const date = new Date(fifteenMinutesAgo.getTime() + i * 60 * 1000);
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();
        const hour = date.getUTCHours();
        const minute = date.getUTCMinutes();

        const existing = readings.find(r => 
            r._id.year === year &&
            r._id.month === month &&
            r._id.day === day &&
            r._id.hour === hour &&
            r._id.minute === minute
        );

        if (existing) {
            filledResults.push(existing);
        } else {
            filledResults.push({
                _id: {
                    year,
                    month,
                    day,
                    hour,
                    minute
                },
                count: 0
            });
        }
    }
    res.send(filledResults);
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
    res.status(200).send({ok: true});

  } catch (error) {
    console.log(error);
    res.status(404).send({ok: false});
  }
});

module.exports = router;
