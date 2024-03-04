const Aedes = require('aedes')
const stats = require('aedes-stats')
const { createServer } = require('net')
const authx = require('./authx');
const Device = require('../db/models/device');
const WebSocket = require("ws");
const QueueManager = require('../io/queue');
const QueueConfig = require('../io/queue/config');
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

async function init(httpServer) {
  const port = process.env.MQTT_PORT || 1883;
  const queue = await QueueManager.init();

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
    console.log('MQTT client \x1b[32m' + (client ? client.id : client) +
            '\x1b[0m subscribed to topics: ' + subscriptions.map(s => s.topic).join('\n'), 'from broker', aedes.id)
  });

  aedes.on('unsubscribe', function (subscriptions, client) {
    console.log('MQTT client \x1b[32m' + (client ? client.id : client) +
            '\x1b[0m unsubscribed to topics: ' + subscriptions.join('\n'), 'from broker', aedes.id)
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
    console.log('Client Disconnected: \x1b[31m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
  })

  // fired when a message is published
  aedes.on('publish', async function (packet, client) {    
    const topic = packet.topic;
    console.log('Client Published: \x1b[32m' + (client ? client.id : client) + '\x1b[0m', 'to broker', topic, JSON.stringify(packet.payload.toString()));
    let clientId = null;
    if (client) {
      clientId = client.id;
      if (client.id === 'ingress_api') {
        // get device id from `v1/username/things/_id/data/json`
        clientId = packet.topic.split('/')[3];
      }
    }

    if (!pubRegex.test(topic)) {
      return;
    }

    if (!topic.includes('data/json')) {
      // save individual readings (temp,k=22)
      // virtual write just sends a single reading for example ... /data/8 
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
        // payload can be of two forms: temp,k=22 or 22
        let uplink = {};
        if (parts.length !== 2) {
          uplink = {
            type: 'virtual',
            unit: '',
            value: payload,
            channel: channel,
          }
        } else {
          const vals = parts[1].split('=');
          uplink = {
            type: parts[0],
            unit: vals[0],
            value: vals[1],
            channel: channel,
          }
        }

        const event = transformData([uplink], client.id);
        const job = {
          metrics: event,
          serial: client.id,
        }
        return Promise.all([
          queue.publish(QueueConfig.EVENTS_CONSUMER, job),
          queue.publish(QueueConfig.RULE_EVALUATOR, job),
        ]);
      } catch (error) {
        console.log(error);
      }
    } else {
      const events = transformData(JSON.parse(packet.payload.toString()), clientId);      
      const job = {
        metrics: events,
        serial: clientId,
      }
      return Promise.all([
        queue.publish(QueueConfig.EVENTS_CONSUMER, job),
        queue.publish(QueueConfig.RULE_EVALUATOR, job),
      ]);
      
    }
  })

  // websocket support
  const wss = new WebSocket.Server({ server: httpServer });

  wss.on('connection', function (ws) {
    const duplex = WebSocket.createWebSocketStream(ws);
    aedes.handle(duplex);
  });

  return aedes;
}

module.exports = { init }