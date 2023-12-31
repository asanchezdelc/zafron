const mongoose = require('mongoose');

const capabilitySchema = new mongoose.Schema({
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


const deviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    serial: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    lastOnline: {
        type: Date,
    },
    attributes: {
        type: Object,
    },
    credentials: {
        type: Object,
    },
    workspaceId: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    capabilities: {
        type: [capabilitySchema],
    },
    // Other fields as needed
}, { timestamps: true });

const Device = mongoose.model('Device', deviceSchema);
module.exports = Device;
