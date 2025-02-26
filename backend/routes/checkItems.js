const express = require('express');
const router = express.Router();
const checkItemController = require('../controllers/checkItemController');
const CheckItem = require('../models/CheckItem');

// 기본 CRUD 라우트
router.post('/', async (req, res) => {
  try {
    const { text, category = '', priority = 'medium' } = req.body;

    if (!text) {
      return res.status(400).json({ message: '텍스트는 필수입니다' });
    }

    const newItem = new CheckItem({
      text,
      category,
      priority,
      isCompleted: false,
      description: '', // 기본값 추가
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error creating check item:', error);
    res.status(500).json({
      message: '아이템 생성 중 오류가 발생했습니다',
      error: error.message,
    });
  }
});

router.get('/', checkItemController.getCheckItems);
router.get('/:id', checkItemController.getCheckItem);
router.put('/:id', async (req, res) => {
  try {
    const { text, isCompleted, category, priority } = req.body;
    const updatedItem = await CheckItem.findByIdAndUpdate(
      req.params.id,
      { text, isCompleted, category, priority },
      { new: true },
    );
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete('/:id', checkItemController.deleteCheckItem);

// 추가 라우트
router.get('/category/:category', checkItemController.getCheckItemsByCategory);
router.get('/priority/:priority', checkItemController.getCheckItemsByPriority);

module.exports = router;
