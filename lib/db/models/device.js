const mongoose = require('mongoose');

const capabilitySchema = require('./capability');

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
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeviceProfile'
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
