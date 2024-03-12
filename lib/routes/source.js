const express = require('express');
const Source = require('../db/models/source');
const DeviceProfile = require('../db/models/device_profile');
const ULID = require('ulid')

const router = new express.Router();

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const sources = await Source.find({ owner: req.user._id })
    .skip(skip)
    .sort({ createdAt: -1 })
    .limit(limit);

  const total = await Source.countDocuments({ owner: req.user._id });

  res.send({
    total,
    pages: Math.ceil(total / limit),
    page,
    limit,
    data: sources,
  });
});

router.post('/', async (req, res) => {
  // generate mask id
  const maskId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const apiKey = ULID.ulid();
  const payload = { 
    name: req.body.name, 
    maskId, 
    owner: req.user._id, 
    type: 'http',
    provider: req.body.provider, 
    apiKey 
  };
  console.log(payload);
  // create a random uuid as API key
  const source = new Source(payload);
  try {
    await source.save();
    res.status(201).send(source);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const source = await Source.findOne({ owner: req.user._id, _id: req.params.id });
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
  const allowedUpdates = ['name', 'provider', 'apiKey', 'decoder', 'tags'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const source = await Source.findOne({ owner: req.user._id, _id: req.params.id });
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
    const profiles = await DeviceProfile.find({ owner: req.user._id, source: req.params.id });
    if (profiles.length > 0) {
      return res.status(400).send({ error: 'Cannot delete source with associated profiles' });
    }
    const source = await Source.findOneAndDelete({ owner: req.user._id, _id: req.params.id });
    if (!source) {
      return res.status(404).send();
    }
    res.send(source);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;