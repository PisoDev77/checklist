const express = require('express');
const router = express.Router();
const numberController = require('../controllers/numberController');

router.post('/', numberController.createNumber);
router.get('/', numberController.getNumbers);
router.put('/:id', numberController.updateNumber);
router.delete('/:id', numberController.deleteNumber);

module.exports = router;
