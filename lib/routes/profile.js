const express = require('express');
const DeviceProfile = require('../db/models/device_profile');
const Device = require('../db/models/device');
const Source = require('../db/models/source');
const decode = require('../decoder/decode');
const schema = require('../decoder/schema');
const router = new express.Router();

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const sources = await DeviceProfile.find({ owner: req.user._id })
    .skip(skip)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('source');

  const total = await DeviceProfile.countDocuments({ owner: req.user._id });

  res.send({
    total,
    pages: Math.ceil(total / limit),
    page,
    limit,
    data: sources,
  });
});

router.post('/', async (req, res) => {
  const payload = {...req.body, owner: req.user._id };
  // make sure protocol is within list
  if (!payload.source) {
    return res.status(400).send({ error: 'Source is required' });
  }

  const src = await Source.findOne({ owner: req.user._id, _id: payload.source });
  if (!src) {
    return res.status(400).send({ error: 'Source not found' });
  }

  const source = new DeviceProfile(payload);
  try {
    await source.save();
    res.status(201).send(source);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const source = await DeviceProfile.findOne({ owner: req.user._id, _id: req.params.id });
    if (!source) {
      return res.status(404).send();
    }
    res.send(source);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch('/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'protocol', 'source', 'decoder'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const source = await DeviceProfile.findOne({ owner: req.user._id, _id: req.params.id });
    if (!source) {
      return res.status(404).send();
    }
    updates.forEach((update) => source[update] = req.body[update]);
    await source.save();
    res.send(source);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/:id', async (req, res) => {
  try {

    const devices = await Device.find({ owner: req.user._id, profile: req.params.id });
    if (devices.length > 0) {
      return res.status(400).send({ error: 'Device profile is in use' });
    }

    const source = await DeviceProfile.findOneAndDelete({ owner: req.user._id, _id: req.params.id });
    if (!source) {
      return res.status(404).send();
    }
    res.send(source);
  } catch (error) {
    res.status(500).send();
  }
});

router.post('/:id/decode', async (req, res) => {
  const pl = req.body.payload;

  if (!pl) {
    return res.status(400).send({ error: 'Payload is required' });
  }

  try {
    const source = await DeviceProfile.findOne({ owner: req.user._id, _id: req.params.id });
    if (!source) {
      return res.status(404).send();
    }
    if (!source.decoder) {
      return res.status(404).send();
    }
    
    const decodedPayload = decode(source.decoder, pl);
    const validation = schema.validate(decodedPayload);
    // validate JSON schema

    const result = {
      decoded: decodedPayload,
      errors: validation.errors,
    };
    
    res.send(result);

  } catch (error) {
    console.log(error);
    console.log(error.message, error.stack)
    res.status(200).send({ errors: [{message: error.message, stack: error.stack }], decoded: null });
  }
});

module.exports = router;