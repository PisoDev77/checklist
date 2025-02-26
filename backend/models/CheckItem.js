const mongoose = require('mongoose');

// 이미 모델이 존재하는지 확인하고, 있다면 그것을 사용
const CheckItem =
  mongoose.models.CheckItem ||
  mongoose.model(
    'CheckItem',
    new mongoose.Schema(
      {
        text: {
          type: String,
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
        category: {
          type: String,
          enum: ['others', 'general'],
          default: 'general',
        },
        priority: {
          type: String,
          enum: ['high', 'medium', 'low'],
          default: 'medium',
        },
        description: {
          type: String,
        },
      },
      {
        timestamps: true,
      },
    ),
  );

module.exports = CheckItem;
