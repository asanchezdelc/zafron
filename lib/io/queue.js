const Queue = require('bee-queue');
const Measurement = require('../db/models/measurement');
const Device = require('../db/models/device');
const redis = require('redis');


async function init() {
  console.log('queue: connecting to redis url');
  const redisClient = await redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost'
  })
  .on('error', (err) => {
    throw err;
  })
  .on('ready', () => {
    console.log('queue: connected to redis');
  }).connect();
  
  const consumerQueue = new Queue('events-consumer', {
    redis: redisClient,
    isWorker: true,
  });

  const ruleEvaluatorQueue = new Queue('rule-evaluator', {
    redis: redisClient,
    isWorker: true,
  });
  
  consumerQueue.on('ready', () => {
    consumerQueue.process( async (job, done) => {
      try {
        // insert metrics into db
        await  Measurement.insertMany(job.data); 
        const capabilities = job.data.map((metric) => {
          return {
            name: metric.metadata.name,
            value: metric.value,
            unit: metric.metadata.unit,
            type: metric.metadata.type,
            channel: metric.metadata.channel,
          }
        });

        let updateOps = {lastOnline: new Date()};
        capabilities.forEach((cap, index) => {
          updateOps[`capabilities.$[cap${index}].value`] = cap.value;
        });

        // update last online and capabilities
        await Device.updateOne(
          { serial: job.data[0].metadata.serial }, 
          { $set: updateOps },
          {
            arrayFilters: capabilities.map((cap, index) => {
                return { [`cap${index}.channel`]: cap.channel }
          })
        });
        done(null, job.data);
      } catch (error) {
        console.log(error)
        done(error);
      }
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
