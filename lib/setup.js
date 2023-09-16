const mqtt = require('./mqtt');
const web = require('./web');
const db = require('./db');
const port = process.env.PORT || 3000;
const queue = require('./io/queue');

function init() {
    const server = web.app.listen(port, () => console.log(`Zafron listening on port ${port}!`));
    // io.init(server);
    mqtt.init( { httpServer: server } );
    queue.init();
    // init db
    db.init();
}

module.exports = { init }