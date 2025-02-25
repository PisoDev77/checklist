const Number = require('../models/Number');

exports.createNumber = async (req, res) => {
  try {
    const number = new Number({ value: 11 });
    await number.save();
    res.status(201).json(number);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getNumbers = async (req, res) => {
  try {
    const numbers = await Number.find();
    res.json(numbers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateNumber = async (req, res) => {
  try {
    const number = await Number.findByIdAndUpdate(
      req.params.id,
      { value: req.body.value },
      { new: true },
    );
    res.json(number);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteNumber = async (req, res) => {
  try {
    await Number.findByIdAndDelete(req.params.id);
    res.json({ message: '숫자가 삭제되었습니다' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
