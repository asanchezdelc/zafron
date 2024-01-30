const redis = require('redis');

class RedisClient {
  constructor() {
    this.client = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost',
    });

    this.client.on('ready', () => {
      console.log('redis client is ready');
    });

    this.client.on('error', (error) => {
      console.error('Error in Redis client:', error);
    });
  }

  static async create() {
    const instance = new RedisClient();
    return instance.client;
  }
}

module.exports = RedisClient;