const Rule = require('../db/models/rule');

const getChannel = (channels, id) => {
  return channels.find((channel) => {
    return channel.id === id;
  });
}

const executeAction = async (rule, uplink) => {
  // rule.action.type
  // send email or perform http request
}

const evaluator = async (job, done) => {
  // job.data
  const uplink = job.data;

  if (uplink.length === 0) {
    return done(null, uplink);
  }

  const serial = uplink[0].metadata.serial;

  const rules = await Rule.find({ serial: serial });

  /**
   * { rule: {}, triggered: true, value: currentValue }
   */
  let triggeredRules = [];
  rules.forEach((rule) => {
    const channel = getChannel(uplink, rule.condition.channel);
    if (channel) {
      const value = channel.value;
      if (rule.condition.operator === 'eq') {
        if (value === rule.value) {
         triggeredRules.push({ ...rule, currentValue: value })
        }
      } else if (rule.condition.operator === 'gt') {
        if (value > rule.value) {
         triggeredRules.push({ ...rule, currentValue: value})
        }
      } else if (rule.condition.operator === 'lt') {
        if (value < rule.value) {
         triggeredRules.push({ ...rule, currentValue: value})
        }
      } else if (rule.condition.operator === 'neq') {
        if (value !== rule.value) {
         triggeredRules.push({ ...rule, currentValue: value})
        }
      }
    }
  });

  triggeredRules.forEach(async (rule) => {
    console.log(rule)
    // update Rule.lastTriggered 
    rule.lastTriggered = new Date();
    // let make sure email notifications are set to 10 per hour
    // calculated based on lastTriggered
    // trigger count?
    await executeAction(rule, uplink);
  });

  done(null, uplink);
  
}

module.exports = { evaluator };