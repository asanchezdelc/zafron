const mongoose = require('mongoose');

const MQTTCredentialsSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  password: {
      type: String,
  },
});

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
      type: String,
    },
    mqttCredentials: {
      type: MQTTCredentialsSchema,
      default: {}
    },
    lastLogin: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
