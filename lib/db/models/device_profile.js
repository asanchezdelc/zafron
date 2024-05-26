const mongoose = require('mongoose');
const capabilitySchema = require('./capability');

const deviceProfile = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    make: {
        type: String,
        trim: true
    },
    source: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Source'
    },
    capabilities: {
      type: [capabilitySchema],
    },
    attributes: {
        type: Object,
    },
    // This is the decoder type (custom, cayennelpp, etc.)
    decoder_type: {
        type: String,
        required: true,
        trim: true
    },
    decoder: {
        type: String,
    },
    encoder: {
        type: String,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace'
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
    // Other fields as needed
}, { timestamps: true });

const DeviceProfile = mongoose.model('DeviceProfile', deviceProfile);
module.exports = DeviceProfile;
