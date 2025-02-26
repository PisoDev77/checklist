const express = require('express');
const router = express.Router();
const checkItemController = require('../controllers/checkItemController');

// 기본 CRUD 라우트
router.post('/', checkItemController.createCheckItem);
router.get('/', checkItemController.getCheckItems);
router.get('/:id', checkItemController.getCheckItem);
router.put('/:id', checkItemController.updateCheckItem);
router.delete('/:id', checkItemController.deleteCheckItem);

// 추가 라우트
router.get('/category/:category', checkItemController.getCheckItemsByCategory);
router.get('/priority/:priority', checkItemController.getCheckItemsByPriority);

module.exports = router;
