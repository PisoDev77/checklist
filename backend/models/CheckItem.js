const mongoose = require('mongoose');

const checkItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  checked: {
    type: Boolean,
    default: false,
  },
  addDate: {
    type: Date,
    default: Date.now,
  },
  updateDateLog: [
    {
      date: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: Boolean,
        required: true,
      },
    },
  ],
  recentUpdateDate: {
    type: Date,
    default: Date.now,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  category: {
    type: String,
    default: 'general',
  },
});

// 체크 상태가 변경될 때마다 updateDateLog에 기록하고 recentUpdateDate 업데이트
checkItemSchema.pre('save', function (next) {
  if (this.isModified('checked')) {
    this.updateDateLog.push({
      date: new Date(),
      status: this.checked,
    });
    this.recentUpdateDate = new Date();
  }
  next();
});

module.exports = mongoose.model('CheckItem', checkItemSchema);
