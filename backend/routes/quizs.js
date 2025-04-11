const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const Quiz = require('../models/quiz');

// 기본 CRUD 라우트
router.post('/', async (req, res) => {
	try {
		const { quiz, answer, category } = req.body;

		if (!quiz) {
			return res.status(400).json({ message: '문제는 필수입니다' });
		}

		if (!answer) {
			return res.status(400).json({ message: '답은 필수입니다' });
		}

		if (!category) {
			return res.status(400).json({ message: '구분은 필수입니다' });
		}

		const newQuiz = new Quiz({
			quiz,
			answer,
			category,
		});

		const savedQuiz = await newQuiz.save();
		res.status(201).json(savedQuiz);
	} catch (error) {
		console.error('Error creating quiz:', error);
		res.status(500).json({
			message: '문제 생성 중 오류가 발생했습니다',
			error: error.message,
		});
	}
});

router.get('/:id', quizController.getQuiz);
router.put('/:id', async (req, res) => {
	try {
		const { quiz, answer, wrongCount } = req.body;
		const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, { quiz, answer, wrongCount }, { new: true });
		res.json(updatedQuiz);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});
router.delete('/:id', quizController.deleteQuiz);
router.get('/category/:category', quizController.getQuizsByCategory);

// 추가 라우트
router.get('/wrongs', quizController.getQuizsByWrongCounts);

module.exports = router;
