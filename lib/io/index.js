const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');  // If you're using JWTs
const User = require('../db/models/user');

let userSockets = [];
let io;

function init(server) {
  console.log('init socket.io server')
  io = new Server(server);
  io.use((socket, next) => {
    // Get the token from the query parameter
    const token = socket.handshake.query.token;
    console.log('auth socket io', token)
    // Verify the token (for demonstration, using JWT)
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return next(new Error('Authentication error'));
        
        // Attach user data to the socket for later use
        const user = await User.findOne({ _id: decoded._id });
        socket.user = { _id: user._id, channel: user.mqttCredentials.username };
        console.log('socket user', socket.user)
        next();
    });
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.user._id} connected`);
    userSockets[socket.user.channel] = socket.id;
    // socket.emit('status', 'connected');

    socket.on('disconnect', () => {
        console.log(`User ${socket.user._id} disconnected`);
        delete userSockets[socket.user.channel];
    });
  });
}

function publish(channel, message) {
  // console.log('publish', channel, message)
  const socketId = userSockets[channel];
  io.to(socketId).emit('device-data', message);
}


module.exports = { init, publish }