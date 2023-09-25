const mqtt = require('./mqtt');
const web = require('./web');
const db = require('./db');
const port = process.env.PORT || 3000;
const queue = require('./io/queue');
const { initEmailSingleton } = require('./services/email');

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
    // init email
    if (process.env.EMAIL_TRANSPORT && process.env.EMAIL_TRANSPORT !== '') {
      await initEmailSingleton({
        transport: process.env.EMAIL_TRANSPORT,
        smtp: {
          host: process.env.EMAIL_SMTP_HOST,
          port: Number(process.env.EMAIL_SMTP_PORT),
          pool: process.env.EMAIL_SMTP_POOL,
          secure: process.env.EMAIL_SMTP_SECURE === 'true',
          user: process.env.EMAIL_SMTP_USER,
          pass: process.env.EMAIL_SMTP_PASSWORD,
        },
      },
      {
        from: process.env.EMAIL_FROM,
      });
    }
  } catch (err) {
    throw err;
  }    
}

module.exports = { init }