const mongoose = require('mongoose');

function init() {
  mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/task-management-api', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  }).then(() => {
      console.log('Connected to MongoDB');
  }).catch((error) => {
      console.log('Error connecting to MongoDB:', error);
  });

  return mongoose;
}

module.exports = { init };