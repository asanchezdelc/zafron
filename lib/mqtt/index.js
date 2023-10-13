const Aedes = require('aedes')
const stats = require('aedes-stats')
const { createServer } = require('net')
const authx = require('./authx');
const Device = require('../db/models/device');
const Queue = require('bee-queue');
const redis = require('../db/redis');

const pubRegex = /^v1\/[a-zA-Z0-9\-]+\/things\/[a-zA-Z0-9]+\/(sys|data).*$/;


function transformData(payload, serial) {
  const events = [];
  const ts = new Date().toISOString();

  for (const item of payload) {

    if (item.type && item.unit && item.value && item.channel) {
      // parses the value into a floar or number
      try {
        item.value = parseFloat(item.value);
      } catch (err) {
        console.log(item.value, err);
      }

      events.push({
        value: item.value,
        timestamp: ts,
        metadata: {
          serial: serial,
          type: item.type,
          unit: item.unit,
          // lets save channel as string
          channel: `${item.channel}`,
        }
      });
    }    
  }

  return events;
}

async function init() {
  const port = process.env.MQTT_PORT || 1883;
  
  const consumerQueue = new Queue('events-consumer', {
    redis: redis,
  });

  const ruleEvaluatorQueue = new Queue('rule-evaluator', {
    redis: redis,
  });

  const aedes = Aedes();

  // 
  if (process.env.ENABLE_MQTT_STATS) {
    stats(aedes)
  }

  const server = createServer(aedes.handle)

  server.listen(port, '0.0.0.0', function () {
    console.log('Zafron MQTT listening on port:', port)
  });

  server.on('error', function (err) {
    console.log('Server error', err)
    process.exit(1);
  });

  aedes.authenticate = authx.authenticate;
  aedes.authorizePublish = authx.authorizePublish;
  aedes.authorizeSubscribe = authx.authorizeSubscribe;

  aedes.on('subscribe', function (subscriptions, client) {
    // console.log('MQTT client \x1b[32m' + (client ? client.id : client) +
    //         '\x1b[0m subscribed to topics: ' + subscriptions.map(s => s.topic).join('\n'), 'from broker', aedes.id)
  });

  aedes.on('unsubscribe', function (subscriptions, client) {
    // console.log('MQTT client \x1b[32m' + (client ? client.id : client) +
    //         '\x1b[0m unsubscribed to topics: ' + subscriptions.join('\n'), 'from broker', aedes.id)
  });

  // fired when a client connects, updates lastOnline
  aedes.on('client', async function (client) {
    console.log('MQTT Client Connected: \x1b[33m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
    const dev = await Device.findOne({ serial: client.id })
    if (!dev) return;

    dev.lastOnline = new Date().toISOString();
    await dev.save();
  });

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
        let channel;
        let payload;

        if (packet.topic !== '') {
          channel = packet.topic.split('/')[5];
        }

        if (packet.payload.toString() !== '') {
          payload = packet.payload.toString();
        }

        if (!channel || !payload) {
          return;
        }

        const parts = payload.split(',');
        if (parts.length !== 2) {
          return;
        }

        const vals = parts[1].split('=');

        const uplink = {
          type: parts[0],
          unit: vals[0],
          value: vals[1],
          channel: channel,
        }

        const event = transformData([uplink], client.id);
        const job = {
          metrics: event,
          serial: client.id,
        }
        return Promise.all([
          consumerQueue.createJob(job).save(),
          ruleEvaluatorQueue.createJob(job).save(),
        ]);
      } catch (error) {
        console.log(error);
      }
    } else {
      const events = transformData(JSON.parse(packet.payload.toString()), client.id);
      const job = {
        metrics: events,
        serial: client.id,
      }
      return Promise.all([
        consumerQueue.createJob(job).save(),
        ruleEvaluatorQueue.createJob(job).save(),
      ]);
      
    }
  })
}

module.exports = { init }