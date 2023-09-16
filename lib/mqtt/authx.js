const User = require('../db/models/user');

const pubRegex = /^v1\/[a-zA-Z0-9\-]+\/things\/[a-zA-Z0-9]+\/data\/[a-zA-Z0-9]+$/
const subRegex = /^v1\/[a-zA-Z0-9\-]+\/things\/[a-zA-Z0-9]+\/cmd\/\+$/

function authenticate(client, username, password, callback) {
  User.findOne({ "mqttCredentials.username": username, "mqttCredentials.password": password })
  .then( user => {
    if (!user) {
      return callback(null, false);
    }
    // check passowrd
    callback(null, true)
  }).catch( error => {
    callback(error, false);
  });
}

function authorizePublish(client, packet, callback) {
  const topic = packet.topic;
  // clients are only able to publish to the following topics
  // v1/username/things/+/data/json
  if (!pubRegex.test(topic)) {
    //console.log('Client invalid publish: \x1b[31m' + (client ? client.id : client) + '\x1b[0m', 'to broker')
    return callback(new Error('wrong topic'))
  }

  // now make sure the client.username matches the username in the topic
  const clientId = topic.split('/')[3];
  if (client.id !== clientId) {
    console.log('Client invalid publish: \x1b[31m' + (client ? client.id : client) + '\x1b[0m', 'to broker')
    return callback(new Error('unauthorized topic'))
  }

  callback(null)
}

function authorizeSubscribe(client, sub, callback) {
  const topic = sub.topic;
  // clients are only able to publish to the following topics
  // v1/username/things/#
  if (!subRegex.test(topic)) {
    return callback(new Error('wrong topic'))
  }

  // now make sure the client.username matches the username in the topic
  const clientId = topic.split('/')[3];
  if (client.id !== clientId) {
    console.log('Client invalid subs: \x1b[31m' + (client ? client.id : client) + '\x1b[0m', 'to broker')
    return callback(new Error('unauthorized topic'))
  }

  callback(null, sub);
}

module.exports = { authenticate, authorizePublish, authorizeSubscribe };