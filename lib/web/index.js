/**
 * Init Web Server
 */
const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const app = express();
const auth = require('../middlewares/auth');
const userRouter = require('../routes/user');
const deviceRouter = require('../routes/device');
const ruleRouter = require('../routes/rule');
const path = require('path');


app.use(cors());

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

app.use('/api/users', userRouter);
app.use('/api/devices', auth, deviceRouter);
app.use('/api/rules', auth, ruleRouter);
// ingress
app.use('/api/ingress', require('../routes/ingress'));
app.use('/api/sources', auth, require('../routes/source'));
app.use('/api/profiles', auth, require('../routes/profile'));

app.get('/api/status', (req, res) => {
    res.send({ status: 'ok' });
});

if (process.env.NODE_ENV === 'production') {
    const publicDir = path.join(__dirname, '/../../build');
  // static folder
    app.use(express.static(publicDir));

    // handle React routing, return all requests to React app
    app.get(/.*/, (req, res) => {
        return res.sendFile(path.join(publicDir, 'index.html'));
    });
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// catch 5xx errors
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send('Something broke!')
});



module.exports = { app }