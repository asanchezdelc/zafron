const Queue = require('bee-queue');
const Telemetric = require('../db/models/telemetric');
const Metric = require('../db/models/metric');
function init() {
  const consumerQueue = new Queue('events-consumer', {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
    },
    isWorker: true,
  });

  const ruleEvaluatorQueue = new Queue('rule-evaluator', {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
    },
    isWorker: true,
  });
  
  consumerQueue.on('ready', () => {
    consumerQueue.process((job, done) => {
      Metric.insertMany(job.data).then(() => {
        console.log(job.data);
        done(null, job.data);
       }).catch((error) => {
        console.log(job.data);
        console.log(error);
         done(error);
        });
      // const telemetric = new Telemetric(job.data.reading);
      // telemetric.save().then(() => {
      //   done(null, job.data);
      // }).catch((error) => {
      //   done(error);
      // });
    });
  });

  ruleEvaluatorQueue.on('ready', () => {
    ruleEvaluatorQueue.process((job, done) => {
      console.log(job.data);
      done(null, job.data);
    });
  });
}

module.exports = { init };