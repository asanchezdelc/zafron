const mqtt = require('./mqtt');
const web = require('./web');
const db = require('./db');
const port = process.env.PORT || 3000;
const queue = require('./io/queue');

async function init() {
  try {
    web.app.listen(port, () => console.log(`Zafron listening on port ${port}!`));
    // io.init(server);
    if (process.env.MQTT_ENABLED === 'true') {
      await mqtt.init();
      await queue.init();
    }
    
    // init db
    db.init();
  } catch (err) {
    throw err;
  }    
}

module.exports = { init }