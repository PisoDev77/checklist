const CheckItem = require('../models/CheckItem');

// 새로운 체크 아이템 생성
exports.createCheckItem = async (req, res) => {
  try {
    const { text, priority, category, description, addDate } = req.body;
    const checkItem = new CheckItem({
      text,
      priority,
      category,
      description,
      addDate: new Date(addDate), // 명시적으로 Date 객체로 변환
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
    const { date } = req.query;
    console.log('Received date query:', date);

    let query = {};
    if (date) {
      // 선택된 날짜의 시작과 끝 (한국 시간 기준)
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      query = {
        addDate: {
          $gte: startDate,
          $lte: endDate,
        },
      };

      console.log('Date filter query:', {
        date,
        startDateISO: startDate.toISOString(),
        endDateISO: endDate.toISOString(),
        startDate,
        endDate,
      });
    }

    // 실제 쿼리 실행 전 로그
    console.log('MongoDB query:', JSON.stringify(query));

    const checkItems = await CheckItem.find(query).sort({ addDate: -1 });

    // 각 아이템의 addDate 확인
    console.log(
      'Found items with dates:',
      checkItems.map((item) => ({
        id: item._id,
        addDate: item.addDate,
        addDateISO: item.addDate.toISOString(),
      })),
    );

    console.log('Total items found:', checkItems.length);

    res.json(checkItems);
  } catch (error) {
    console.error('Error in getCheckItems:', error);
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
    if (req.body.text) checkItem.text = req.body.text;
    if (req.body.description) checkItem.description = req.body.description;
    if (typeof req.body.completed === 'boolean')
      checkItem.completed = req.body.completed;
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
