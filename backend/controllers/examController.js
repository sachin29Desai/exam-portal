// backend/controllers/examController.js

const Exam = require('../models/Exam');

// Create a new exam
exports.createExam = async (req, res) => {
  try {
    const { title, description, questionIds, durationMinutes, isActive } = req.body;
    if (!title || !durationMinutes) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
    const exam = await Exam.create({
      title,
      description,
      questionIds,
      durationMinutes,
      isActive
    });
    res.status(201).json(exam);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create exam.', error: err.message });
  }
};

// Get all exams
exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find().populate('questionIds');
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch exams.', error: err.message });
  }
};

// Get a single exam by ID
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('questionIds');
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found.' });
    }
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch exam.', error: err.message });
  }
};

// Update an exam by ID
exports.updateExam = async (req, res) => {
  try {
    const updates = req.body;
    updates.updatedAt = Date.now();
    const exam = await Exam.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found.' });
    }
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update exam.', error: err.message });
  }
};

// Delete an exam by ID
exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found.' });
    }
    res.json({ message: 'Exam deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete exam.', error: err.message });
  }
};