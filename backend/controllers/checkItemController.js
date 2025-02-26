const CheckItem = require('../models/CheckItem');

// 새로운 체크 아이템 생성
exports.createCheckItem = async (req, res) => {
  try {
    const checkItem = new CheckItem({
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      category: req.body.category,
    });

    const savedItem = await checkItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 모든 체크 아이템 조회
exports.getCheckItems = async (req, res) => {
  try {
    const checkItems = await CheckItem.find().sort({ recentUpdateDate: -1 });
    res.json(checkItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 특정 체크 아이템 조회
exports.getCheckItem = async (req, res) => {
  try {
    const checkItem = await CheckItem.findById(req.params.id);
    if (!checkItem) {
      return res
        .status(404)
        .json({ message: '체크 아이템을 찾을 수 없습니다' });
    }
    res.json(checkItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 체크 아이템 업데이트
exports.updateCheckItem = async (req, res) => {
  try {
    const checkItem = await CheckItem.findById(req.params.id);
    if (!checkItem) {
      return res
        .status(404)
        .json({ message: '체크 아이템을 찾을 수 없습니다' });
    }

    // 업데이트할 필드들을 설정
    if (req.body.title) checkItem.title = req.body.title;
    if (req.body.description) checkItem.description = req.body.description;
    if (typeof req.body.checked === 'boolean')
      checkItem.checked = req.body.checked;
    if (req.body.priority) checkItem.priority = req.body.priority;
    if (req.body.category) checkItem.category = req.body.category;

    const updatedItem = await checkItem.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 체크 아이템 삭제
exports.deleteCheckItem = async (req, res) => {
  try {
    const checkItem = await CheckItem.findById(req.params.id);
    if (!checkItem) {
      return res
        .status(404)
        .json({ message: '체크 아이템을 찾을 수 없습니다' });
    }

    await checkItem.deleteOne();
    res.json({ message: '체크 아이템이 삭제되었습니다' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 카테고리별 체크 아이템 조회
exports.getCheckItemsByCategory = async (req, res) => {
  try {
    const checkItems = await CheckItem.find({
      category: req.params.category,
    }).sort({ recentUpdateDate: -1 });
    res.json(checkItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 우선순위별 체크 아이템 조회
exports.getCheckItemsByPriority = async (req, res) => {
  try {
    const checkItems = await CheckItem.find({
      priority: req.params.priority,
    }).sort({ recentUpdateDate: -1 });
    res.json(checkItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
