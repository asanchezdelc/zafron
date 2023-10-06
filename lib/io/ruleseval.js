const Rule = require('../db/models/rule');
const axios = require('axios');
const { send } = require('../services/email');

const getChannel = (sensors, channel) => {
  return sensors.find((sensor) => {
    return sensor.metadata.channel === channel;
  });
}

const executeAction = async (rule, uplink) => {
  const payload = {
    deviceId: rule.deviceId,
    serial: rule.serial,
    ruleId: rule._id,
    ruleName: rule.name,
    triggeredValue: rule.triggeredValue,
    channel: rule.condition.channel,
    triggeredAt: new Date(),
  };

  rule.triggeredAt = new Date();
  await rule.save();
  // rule.action.type
  // send email or perform http request
  if (rule.action.type === 'email') {
    // console.log('send email', rule.action.value);
    await send('alert-notification', { 
      to: rule.action.value, 
      subject: 'Zafron: Alert Notification' 
    }, payload);

    return;
  }

  if (rule.action.type === 'webhook') {
    // console.log('send webhook', rule.action.value);
    await axios.post(rule.action.value, payload);
    return;
  }
}

const evaluator = async (job, done) => {
  // job.data
  const metrics = job.data.metrics;

  if (metrics.length === 0) {
    return done(null, {});
  }

  const serial = job.data.serial;

  const rules = await Rule.find({ serial: serial });

  if (rules.length === 0) {
    return done(null, {});
  }

  /**
   * { rule: {}, triggered: true, value: currentValue }
   */
  let triggeredRules = [];
  rules.forEach((rule) => {
    console.log(rule);
    const channel = getChannel(metrics, rule.condition.channel);
    if (channel) {
      const currentValue = channel.value;
      const ruleValue = Number(rule.condition.value);
      if (rule.condition.operator === 'eq') {
        if (currentValue === ruleValue) {
          rule.triggeredValue = currentValue;
          triggeredRules.push(rule)
        }
      } else if (rule.condition.operator === 'gt') {
        if (currentValue > ruleValue) {
          rule.triggeredValue = currentValue;
          triggeredRules.push(rule)
        }
      } else if (rule.condition.operator === 'lt') {
        if (currentValue < ruleValue) {
          rule.triggeredValue = currentValue;
          triggeredRules.push(rule)
        }
      } else if (rule.condition.operator === 'neq') {
        if (currentValue !== ruleValue) {
          rule.triggeredValue = currentValue;
          triggeredRules.push(rule)
        }
      }
    }
  });

  triggeredRules.forEach(async (rule) => {
    await executeAction(rule);
  });

  done(null, { completed: true });
  
}

module.exports = evaluator;