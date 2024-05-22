const amqplib = require('amqplib');
const consumer = require('../consumer');
const ruleeval = require('../ruleseval');

const config = require('./config');

class RabbitQueue {
  constructor() {
    this.conn = null;
    this.eventsPublisher = null;
    this.rulePublisher = null;
  }

  static async create() {
    const queue = new RabbitQueue();
    await queue.init();
    return queue;
  }

  async init() {
    console.log('init queue engine using rabbitmq (amqp)');
    const eventsQueue = config.EVENTS_CONSUMER;
    const ruleQueue = config.RULE_EVALUATOR;
    const amqpUrl = process.env.AMQP_URL || 'amqp://localhost';
  
    this.conn = await amqplib.connect(amqpUrl);
  
    this.eventsChannel = await this.conn.createChannel();
    await this.eventsChannel.assertQueue(eventsQueue);
  
    this.ruleChannel = await this.conn.createChannel();
    await this.ruleChannel.assertQueue(ruleQueue);
    
    const self = this;
    // Listener
    this.eventsChannel.consume(eventsQueue, (msg) => {
      if (msg !== null) {
        console.log('Recieved:', msg.content.toString());
        const parsedMsg = JSON.parse(msg.content.toString());
        consumer(parsedMsg, function() {
          self.eventsChannel.ack(msg);
        });
      } else {
        console.log('Consumer cancelled by server');
      }
    });
  
    this.ruleChannel.consume(ruleQueue, (msg) => {
      if (msg !== null) {
        console.log('Recieved:', msg.content.toString());
        ruleeval(JSON.parse(msg.content.toString()), function() {
          self.ruleChannel.ack(msg);
        });
      } else {
        console.log('Consumer cancelled by server');
      }
    });
  
    this.eventsPublisher = await this.conn.createChannel();
    this.rulePublisher = await this.conn.createChannel();

    return RabbitQueue.instance;
  }

  static async getInstance() {
    if (!RabbitQueue.instance) {
      RabbitQueue.instance = await RabbitQueue.create();
    }
    return RabbitQueue.instance;
  }

  publish = (queue, msg) => {
    if (queue === config.EVENTS_CONSUMER) {
      this.eventsPublisher.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
    } else if (queue === config.RULE_EVALUATOR) {
      this.rulePublisher.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
    }
  }
}

module.exports = RabbitQueue;