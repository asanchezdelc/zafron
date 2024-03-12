const User = require('../db/models/user');

const pubRegex = /^v1\/[a-zA-Z0-9\-]+\/things\/[a-zA-Z0-9+]+\/(response|sys|data|cmd).*$/;
const subRegex = /^v1\/[a-zA-Z0-9\-]+\/things\/[a-zA-Z0-9+]+\/(response|cmd|conf|data).*$/;
const INGRESS_API_USER = 'ingress_api';

function authenticate(client, username, password, callback) {
  if (!username || !password) return callback(null, false);
  console.log('Client authenticating: \x1b[32m' + username + '\x1b[0m', 'to broker');
  console.log(password);
  // check for a system client
  if (username === 'ingress_api' && password.toString('utf8') === process.env.MQTT_SYS_PASSWORD) {
    client.username = username;
    return callback(null, true);
  }

  User.findOne({ "mqttCredentials.username": username, "mqttCredentials.password": password })
  .then( user => {
    if (!user) {
      console.log('invalid client authentication: \x1b[31m' +username + '\x1b[0m', 'to broker')
      return callback(null, false);
    }
    client.username = username;
    // check passowrd
    callback(null, true);
  }).catch( error => {
    callback(error, false);
  });
}

function authorizePublish(client, packet, callback) {
  const topic = packet.topic;
  // clients are only able to publish to the following topics
  // v1/username/things/+/data/json
  if (!pubRegex.test(topic)) {
    console.log('Client invalid publish: \x1b[31m' + (client ? client.id : client) + '\x1b[0m', 'to broker', topic)
    return callback(new Error('wrong topic'))
  }

  if (client.id === INGRESS_API_USER) {
    return callback(null);
  }
  // now make sure the client.username matches the username in the topic
  const username = topic.split('/')[1];
  if (client.username !== username) {
    console.log('Client is different? invalid publish: \x1b[31m' + (client ? client.id : client) + '\x1b[0m', 'to broker', topic)
    return callback(new Error('unauthorized topic'))
  }

  callback(null)
}

function authorizeSubscribe(client, sub, callback) {
  const topic = sub.topic;
  // clients are only able to publish to the following topics
  // v1/username/things/#
  if (!subRegex.test(topic)) {
    console.log('Client invalid subscribe: \x1b[31m' + (client ? client.id : client) + '\x1b[0m', 'to broker', topic)
    return callback(new Error('wrong topic'))
  }

  // now make sure the client.username matches the username in the topic
  const clientId = topic.split('/')[3];
  if (client.id !== clientId && client.id.indexOf('zafron-web') === -1) {
    console.log('Client invalid subs: \x1b[31m' + (client ? client.id : client) + '\x1b[0m', 'to broker', topic)
    return callback(new Error('unauthorized topic'))
  }

  callback(null, sub);
}

module.exports = { authenticate, authorizePublish, authorizeSubscribe };