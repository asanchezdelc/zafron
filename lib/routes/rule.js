const express = require('express');
const Rule = require('../db/models/rule');

const router = new express.Router();

const operators = ['eq', 'ne', 'gt', 'lt', 'gte', 'lte'];
const actions = ['webhook', 'email', 'sms'];

//TODO: Lets use Joi for validation
const validateRule = (rule) => {
  if (!rule.name) {
    return 'Name is required';
  }

  if (!rule.condition) {
    return 'Condition is required';
  }

  if (!rule.capability) {
    return 'Channel is required';
  }

  if (!rule.condition) {
    return 'Operator is required';
  }

  if (!rule.value) {
    return 'Value is required';
  }

  if (!rule.actionType) {
    return 'Action is required';
  }

  if (!rule.deviceId) {
    return 'Device ID is required';
  }

  if (!rule.serial) {
    return 'Device serial is required';
  }

  return null;
}

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
    await dev.save();
    res.status(201).send(dev);
  } catch (error) {
    console.log(error, 'error while creating rule');
    res.status(500).send({ error: 'Server error while creating a rule'});
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
    const rule = await Rule.findOne({ owner: req.user._id, _id: req.params.id });
    if (!rule) {
      return res.status(404).send();
    }

    const validationError = validateRule(req.body);
    if (validationError) {
      return res.status(400).send({ error: validationError });
    }

    rule.name = req.body.name;
    rule.condition.channel = req.body.capability;
    rule.condition.operator = req.body.condition;
    rule.condition.value = req.body.value;
    rule.action.type = req.body.actionType;
    rule.action.value = req.body.email || req.body.webhook;
    rule.enabled = req.body.enabled;
    
    await rule.save();
    res.send(rule);
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