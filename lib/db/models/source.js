const mongoose = require('mongoose');

const sourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    maskId: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    // LoraNetwork/HTTP/UDP etc
    provider: {
        type: String,
        required: true,
        trim: true
    },
    apiKey: {
        type: String,
        required: true,
        trim: true
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'Workspace'
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
    // Other fields as needed
}, { timestamps: true });

const Source = mongoose.model('Source', sourceSchema);
module.exports = Source;
