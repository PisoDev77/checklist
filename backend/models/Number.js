const mongoose = require('mongoose');

const numberSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
    default: 11,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Number', numberSchema);
