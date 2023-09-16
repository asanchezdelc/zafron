const Queue = require('bee-queue');
const Telemetric = require('../db/models/telemetric');

function init() {
  const consumerQueue = new Queue('events-consumer', {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
    },
    isWorker: true,
  });
  
  consumerQueue.on('ready', () => {
    consumerQueue.process((job, done) => {
      const telemetric = new Telemetric(job.data.reading);
      telemetric.save().then(() => {
        done(null, job.data);
      }).catch((error) => {
        done(error);
      });
    });
  });
}

module.exports = { init };