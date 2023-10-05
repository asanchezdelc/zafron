const express = require('express');
const Rule = require('../db/models/rule');

const router = new express.Router();

const operators = ['eq', 'ne', 'gt', 'lt', 'gte', 'lte'];
const actions = ['webhook', 'email', 'sms'];


router.post('/', async (req, res) => {
  try {

    // get current rules count per user (max 5)
    const count = await Rule.countDocuments({ owner: req.user._id });

    if (count >= 5) {
      return res.status(400).send({ error: 'Maximum rules per user reached' });
    }

    // validate operator
    if (!operators.includes(req.body.condition)) {
      return res.status(400).send({ error: 'Invalid operator' });
    }

    // validate action
    if (!actions.includes(req.body.actionType)) {
      return res.status(400).send({ error: 'Invalid action' });
    }

    // validate email
    if (req.body.actionType === 'email' && !req.body.email) {
      return res.status(400).send({ error: 'Email is required' });
    }

    // validate webhook
    if (req.body.actionType === 'webhook' && !req.body.webhook) {
      return res.status(400).send({ error: 'Webhook is required' });
    }

    // validate value to be numeric
    if (isNaN(parseFloat(req.body.value))) {
      return res.status(400).send({ error: 'Value must be numeric' });
    }

    const rule = {
      name: req.body.name,
      condition: {
        channel: req.body.capability,
        operator: req.body.condition,
        value: req.body.value,
      },
      action: {
        type: req.body.actionType,
        value: req.body.email || req.body.webhook,
      },
      deviceId: req.body.deviceId,
      serial: req.body.serial,
      owner: req.user._id,
    }

    const dev = new Rule(rule);
    dev.save();
    res.status(201).send(dev);
  } catch (error) {
    res.status(500).send({ error: 'Server Error'});
  }
});

router.get('/', async (req, res) => {
  try {
    // we need to add pagination to this query.
    const rules = await Rule.find({ owner: req.user._id, deviceId: req.query.device_id }, null, { sort: { createdAt: -1 } });
    res.send({ rows: rules });
  } catch (error) {
    res.status(500).send({ error: 'Server Error'});
  }
});

router.get('/:id', async (req, res) => {
  try {
    const rule = await Rule.findOne({ owner: req.user._id, _id: req.params.id });
    res.send(rule);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const dev = await Rule.findOne({ owner: req.user._id, _id: req.params.id });
    if (!dev) {
      return res.status(404).send();
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

router.put('/:id', async (req, res) => {
  try {
    const dev = await Rule.findOne({ owner: req.user._id, _id: req.params.id });
    if (!dev) {
      return res.status(404).send();
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
    const dev = await Rule.findOne({ owner: req.user._id, _id: req.params.id });
    if (!dev) {
      return res.status(404).send();
    }
    
    await Rule.deleteOne({ owner: req.user._id, _id: req.params.id })
    res.status(200).send({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Server Error'});
  }
});

module.exports = router;