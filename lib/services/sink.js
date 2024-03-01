const mqtt = require('mqtt');

const uri = new URL(process.env.MQTT_URI || 'mqtt://localhost:1883?clientId=ingress_api');

const client = mqtt.connect(`mqtt://${uri.host}`, {
  clientId: uri.searchParams.get('clientId') || 'ingress_api',
  username: uri.username || 'ingress_api',
  password: uri.password,
  keepalive: 60,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
});

function getPublishTopic(owner, serial) {
  return `v1/${owner}/devices/${serial}/data/json`;
}

function publish(owner, serial, payload) {
  client.publish(getPublishTopic(owner, serial), payload);
}



module.exports = { publish };