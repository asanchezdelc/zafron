const Queue = require('bee-queue');
const redis = require('../db/redis')

const consumer = require('./consumer');
const ruleeval = require('./ruleseval');

async function init() {
  const consumerQueue = new Queue('events-consumer', {
    redis: redis,
    isWorker: true,
    // does not reprocess failed jobs for now
    removeOnFailure: true,
  });

  const ruleEvaluatorQueue = new Queue('rule-evaluator', {
    redis: redis,
    isWorker: true,
    // does not reprocess failed jobs for now
    removeOnFailure: true,
  });
  
  consumerQueue.on('ready', () => {
    consumerQueue.process(consumer);
  });

  ruleEvaluatorQueue.on('ready', () => {
    ruleEvaluatorQueue.process(ruleeval);
  });
}

module.exports = { init };
