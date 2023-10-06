const mongoose = require('mongoose');

const conditionSchema = new mongoose.Schema({
  channel: {
    type: String,
    required: true,
  },
  // gt, lt, eq, neq
  operator: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  }
});

const actionSchema = new mongoose.Schema({
  // alert, webhook, email, sms
  type: {
    type: String,
  },
  value: {
    type: String,
  },
});

const ruleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    condition: {
        type: conditionSchema,
        required: true,
    },
    action: {
        type: actionSchema,
        required: true,
    },
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Device'
    },
    serial: {
      type: String,
      required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    triggeredAt: {
      type: Date,
    },
    triggeredValue: {
      type: Number,
    }
    // Other fields as needed
}, { timestamps: true });

const Rule = mongoose.model('Rule', ruleSchema);
module.exports = Rule;
