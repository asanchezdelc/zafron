const mongoose = require('mongoose');

const conditionSchema = new mongoose.Schema({
  field: {
    type: String,
    required: true,
  },
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
  actionType: {
    type: String,
  },
  message: {
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
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
    // Other fields as needed
}, { timestamps: true });

const Rule = mongoose.model('Device', ruleSchema);
module.exports = Rule;
