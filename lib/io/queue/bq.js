const Queue = require('bee-queue');
const redis = require('../../db/redis')
const config = require('./config');
const consumer = require('../consumer');
const ruleeval = require('../ruleseval');

class BQueue {
  constructor() {
    if (!BQueue.instance) {
      console.log('not singleton');
      this._consumerQueue = new Queue('events-consumer', {
        redis: redis,
        isWorker: true,
        removeOnFailure: true,
      });

      this._ruleEvaluatorQueue = new Queue('rule-evaluator', {
        redis: redis,
        isWorker: true,
        removeOnFailure: true,
        storeJobs: false,
      });

      this._eventsPublisher = new Queue('events-consumer', {
        redis: redis,
      });

      this._ruleEvalPublisher = new Queue('rule-evaluator', {
        redis: redis,
      });

      this._consumerQueue.on('ready', () => {
        this._consumerQueue.process((job, done) => {
          consumer(job.data, done);
        });
      });

      this._ruleEvaluatorQueue.on('ready', () => {
        this._ruleEvaluatorQueue.process((job, done) => {
          ruleeval(job.data, done);
        });
      });

      BQueue.instance = this;
    }

    return BQueue.instance;
  }

  publish = (queue, msg) => {
    if (queue === config.EVENTS_CONSUMER) {
      this._eventsPublisher.createJob(msg).save();
    } else if (queue === config.RULE_EVALUATOR) {
      this._ruleEvalPublisher.createJob(msg).save();
    }
  }
}


const queueManager = new BQueue();
Object.freeze(queueManager);

module.exports = queueManager;

