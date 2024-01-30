const Rule = require('../db/models/rule');
const axios = require('axios');
const { send } = require('../services/email');

// offset minutes between last triggered time and current time
const OFFSET_TIME_MIN = process.env.NOTIFICATION_OFFSET_MIN || 15;

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
  // rule.action.type
  // send email or perform http request
  if (rule.action.type === 'email') {
    // console.log('send email', rule.action.value);
    await send('alert-notification', { 
      to: rule.action.value, 
      subject: 'Zafron: Alert Notification' 
    }, payload);
  }

  if (rule.action.type === 'webhook') {
    // console.log('send webhook', rule.action.value);
    await axios.post(rule.action.value, payload);
  }

  // update rule
  await rule.save();

  return;
}

const evaluator = async (msg, done) => {
  // msg
  const metrics = msg.metrics;

  if (metrics.length === 0) {
    return done(null, {});
  }

  const serial = msg.serial;

  const rules = await Rule.find({ serial: serial, enabled: true });

  if (rules.length === 0) {
    return done(null, {});
  }

  /**
   * { rule: {}, triggered: true, value: currentValue }
   */
  let triggeredRules = [];
  rules.forEach((rule) => {
    // check if the lastTriggeredAt is within the last 15 minutes
    // if so, skip
    // this makes sure users are not spammed with alerts and limit notifications
    if (rule.triggeredAt) {
      const lastTriggeredAt = new Date(rule.triggeredAt);
      const now = new Date();
      const diff = now.getTime() - lastTriggeredAt.getTime();
      const diffInMinutes = diff / 1000 / 60;
      if (diffInMinutes < OFFSET_TIME_MIN) {
        return;
      }
    }
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