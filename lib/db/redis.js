const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost',
});

client.on('ready', () => {
  console.log('redis client is ready');
});

client.on('error', (error) => {
  console.error('Error in Redis client:', error);
});

module.exports = client;