const mongoose = require('mongoose');

const TelemetricSchema = new mongoose.Schema(
  { 
    device_id: String,
    readings: Object,
    timestamp: Date, 
    metadata: Object
  },
  {
    timeseries: {
      timeField: 'timestamp',
      metaField: 'metadata',
      granularity: 'minutes',
    },
});

const Telemetric = mongoose.model('telemetric', TelemetricSchema);
module.exports = Telemetric;
