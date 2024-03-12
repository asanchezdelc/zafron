const mongoose = require('mongoose');

const Capability = new mongoose.Schema({
  name: { 
    type: String,
  },
  value: {
    type: Number,
  },
  channel: {
    type: String,
  },
  type: {
    type: String,
  },
  unit: {
    type: String,
  },
  icon: {
    type: String,
  },
});

module.exports = Capability;