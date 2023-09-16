const Aedes = require('aedes')
const stats = require('aedes-stats')
const { createServer } = require('net')
const authx = require('./authx');
const Device = require('../db/models/devices');
const io = require('../io');
const { channel } = require('diagnostics_channel');
const Queue = require('bee-queue');
const consumerQueue = new Queue('events-consumer', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
  },
  isWorker: false,
});

const pubRegex = /^v1\/[a-zA-Z0-9\-]+\/things\/[a-zA-Z0-9]+\/data\/[a-zA-Z0-9]+$/

function transformData(payload, deviceId) {
  const transformedData = {
      device_id: deviceId,
      timestamp: new Date().toISOString(),  // Current timestamp
      readings: {},
      metadata: {}
  };

  for (const item of payload) {
      const sensorName = item.type;
      transformedData.readings[sensorName] = item.value;

      // Remove the value from the item and store the rest as metadata
      const { value, ...metadata } = item;
      transformedData.metadata[sensorName] = metadata;
  }

  return transformedData;
}

function init () {
  const port = process.env.MQTT_PORT || 1883;

  const aedes = Aedes({
  })

  // 
  if (process.env.ENABLE_MQTT_STATS) stats(aedes)

  const server = createServer(aedes.handle)

  server.listen(port, '0.0.0.0', function () {
    console.log('Zafron MQTT listening on port:', port)
  });

  server.on('error', function (err) {
    console.log('Server error', err)
    process.exit(1)
  })

  aedes.authenticate = authx.authenticate;
  aedes.authorizePublish = authx.authorizePublish;
  aedes.authorizeSubscribe = authx.authorizeSubscribe;

  aedes.on('subscribe', function (subscriptions, client) {
    // console.log('MQTT client \x1b[32m' + (client ? client.id : client) +
    //         '\x1b[0m subscribed to topics: ' + subscriptions.map(s => s.topic).join('\n'), 'from broker', aedes.id)
  })

  aedes.on('unsubscribe', function (subscriptions, client) {
    // console.log('MQTT client \x1b[32m' + (client ? client.id : client) +
    //         '\x1b[0m unsubscribed to topics: ' + subscriptions.join('\n'), 'from broker', aedes.id)
  })

  // fired when a client connects, updates lastOnline
  aedes.on('client', async function (client) {
    console.log('MQTT Client Connected: \x1b[33m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
    const dev = await Device.findOne({ serial: client.id })
    if (!dev) return;

    dev.lastOnline = new Date().toISOString();
    await dev.save();
  })

  // fired when a client disconnects
  aedes.on('clientDisconnect', function (client) {
    // console.log('Client Disconnected: \x1b[31m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
  })

  // fired when a message is published
  aedes.on('publish', async function (packet, client) {    
    const topic = packet.topic;
    if (!pubRegex.test(topic)) {
      return;
    }

    if (!topic.includes('data/json')) {
      // save individual readings (temp,k=22)
      // parse payload
      try {
        // v1/+/things/+/data/12
        const channel = packet.topic.split('/')[5];
        const payload = packet.payload.toString();
        const parts = payload.split(',');
        const vals = parts[1].split('=');

        const uplink = {
          type: parts[0],
          unit: vals[0],
          value: vals[1],
          channel: channel,
        }

        const reading = transformData([uplink], client.id);
        consumerQueue.createJob({ reading }).save().then((job) => {
        return;
      });

      } catch (error) {
        console.log(error);
      }
    } else {
      const reading = transformData(JSON.parse(packet.payload.toString()), client.id);
      consumerQueue.createJob({ reading }).save().then((job) => {
        return;
      });;
    }
  })
}

module.exports = { init }