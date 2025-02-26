const mongoose = require('mongoose');

const checkItemSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    default: 'general',
  },
  priority: {
    type: String,
    default: 'medium',
  },
  addDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updateDateLog: [
    {
      type: Date,
    },
  ],
  recentUpdateDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CheckItem', checkItemSchema);
