const BQueue = require('./bq');
const Rabbit = require('./rabbit');

const init = async () => {
  const qEngine = process.env.QUEUE_ENGINE || 'bq';
  if (qEngine === 'bq') {
    return BQueue;
  } else if (qEngine === 'rabbit') {
    const instance = await Rabbit.getInstance();
    return instance;
  }
}

module.exports = { init };