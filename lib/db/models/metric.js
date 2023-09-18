const mongoose = require('mongoose');

const MetricSchema = new mongoose.Schema(
  { 
    serial: String,
    value: Number,
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

const Telemetric = mongoose.model('metric', MetricSchema);
module.exports = Telemetric;
