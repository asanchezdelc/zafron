const Queue = require('bee-queue');
const RedisClient = require('../../db/redis')
const config = require('./config');
const consumer = require('../consumer');
const ruleeval = require('../ruleseval');

class BQueue {
  constructor() {
    this._consumerQueue = null;
    this._ruleEvaluatorQueue = null;
    this._eventsPublisher = null;
    this._ruleEvalPublisher = null;
  }

  static async create() { 
    const queue = new BQueue();
    await queue.init();
    return queue;
  }

  async init() {
    console.log('BQueue instance created')
      const redis = await RedisClient.create();
      this._consumerQueue = new Queue('events-consumer', {
        redis: redis,
        isWorker: true,
        removeOnFailure: true,
      });

      this._ruleEvaluatorQueue = new Queue('rule-evaluator', {
        redis: redis,
        isWorker: true,
        removeOnFailure: true,
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


module.exports = BQueue;

