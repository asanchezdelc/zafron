const mongoose = require('mongoose');

const MeasurementSchema = new mongoose.Schema(
  { 
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

const Measurement = mongoose.model('metric', MeasurementSchema);
module.exports = Measurement;
