const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
	quiz: {
		type: String,
		required: true,
	},
	answer: {
		type: String,
		required: true,
		default: false,
	},
	wrongCount: {
		type: Number,
		default: 0,
	},
	category: {
		type: String,
		required: true,
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

module.exports = mongoose.model('Quiz', QuizSchema);
