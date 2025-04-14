const Quiz = require('../models/Quiz');

// 새로운 체크 아이템 생성
exports.createQuiz = async (req, res) => {
	try {
		const { quiz, answer, category, addDate } = req.body;
		const newQuiz = new Quiz({
			quiz,
			answer,
			category,
			wrongCount: 0,
			addDate: new Date(addDate), // 명시적으로 Date 객체로 변환
		});
		const savedQuiz = await newQuiz.save();
		res.status(201).json(savedQuiz);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.getQuiz = async (req, res) => {
	try {
		const quiz = await Quiz.findById(req.params.id);
		if (!quiz) {
			return res.status(404).json({ message: '문제를 찾을 수 없습니다' });
		}
		res.json(quiz);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.updateQuiz = async (req, res) => {
	try {
		const quiz = await Quiz.findById(req.params.id);
		if (!quiz) {
			return res.status(404).json({ message: '문제를 찾을 수 없습니다' });
		}

		// 업데이트할 필드들을 설정
		if (req.body.quiz) quiz.quiz = req.body.quiz;
		if (req.body.answer) quiz.answer = req.body.answer;
		if (req.body.category) quiz.category = req.body.category;
		if (req.body.wrongCount) quiz.wrongCount = req.body.wrongCount;

		const updatedQuiz = await quiz.save();
		res.json(updatedQuiz);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.deleteQuiz = async (req, res) => {
	try {
		const quiz = await Quiz.findById(req.params.id);
		if (!quiz) {
			return res.status(404).json({ message: '문제를 찾을 수 없습니다' });
		}

		await quiz.deleteOne();
		res.json({ message: '문제가 삭제되었습니다' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// 카테고리별 퀴즈 조회
exports.getQuizsByCategory = async (req, res) => {
	try {
		const category = decodeURIComponent(req.params.category);
		const quizs = await Quiz.find({ category }).sort({ recentUpdateDate: -1 });
		res.json(quizs);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.getQuizsByWrongCounts = async (req, res) => {
	try {
		const quizs = await Quiz.find({
			wrongCount: { $gte: 1 },
		}).sort({ wrongCount: -1, recentUpdateDate: -1 });
		res.json(quizs);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// 카테고리 목록 조회
exports.getCategories = async (req, res) => {
	try {
		const categories = await Quiz.find().distinct('category');
		console.log(categories);
		res.json(categories);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
};

module.exports = exports;
