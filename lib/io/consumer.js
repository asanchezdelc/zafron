const Measurement = require('../db/models/measurement');
const Device = require('../db/models/device');

const MAX_COUNT_HOUR = 480;

/**
 * Start a consumer for the job queue and inserts data into database
 * @param {*} job 
 * @param {*} done 
 */
const consumer = async (msg, done) => {
  console.log('storing data for:', msg.serial);
  try {

    // check current count of measurements
    const lastHour = new Date(new Date() - 60 * 60 * 1000);

    const count = await Measurement.countDocuments({
      timestamp: { '$gte': lastHour },
      "metadata.serial": msg.serial 
    });

    console.log(`device (${msg.serial}) count ${count} in the last hour`);

    if (count >= MAX_COUNT_HOUR) {
      console.log(`device (${msg.serial}) count reached max count in the last hour`);
      return done(null, msg);
    }

    // lets not store empty metrics
    if (msg.metrics.length === 0) {
      return done(null, msg);
    }
    
    // insert metrics into tsdb metrics db
    await  Measurement.insertMany(msg.metrics); 

    // upsert device capability
    const capabilities = msg.metrics.map((metric) => {
      return {
        name: metric.metadata.name,
        value: metric.value,
        unit: metric.metadata.unit,
        type: metric.metadata.type,
        channel: metric.metadata.channel+"",
      }
    });

    let updateOps = {lastOnline: new Date()};
    capabilities.forEach((cap, index) => {
      updateOps[`capabilities.$[cap${index}].value`] = cap.value;
    });

    // update last online and capabilities
    await Device.updateOne(
      { serial: msg.serial }, 
      { $set: updateOps },
      {
        arrayFilters: capabilities.map((cap, index) => {
            return { [`cap${index}.channel`]: cap.channel }
      })
    });
    done(null, msg);
  } catch (error) {
    console.log(error)
    done(error);
  }
}

module.exports = consumer;