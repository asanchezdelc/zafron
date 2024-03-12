const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    attributes: {
        type: Object,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
    // Other fields as needed
}, { timestamps: true });

const Workspace = mongoose.model('Workspace', workspaceSchema);
module.exports = Workspace;
