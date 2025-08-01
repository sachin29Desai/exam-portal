// backend/controllers/questionController.js

const Question = require('../models/Question');

// Create a new question (for admin/future use)
exports.createQuestion = async (req, res) => {
  try {
    const { text, choices, correctAnswer, tags } = req.body;
    if (!text || !choices || !correctAnswer) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
    const question = await Question.create({ text, choices, correctAnswer, tags });
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create question.', error: err.message });
  }
};

// Get all questions (for exam creation/admin)
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch questions.', error: err.message });
  }
};

// Get a single question by ID
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found.' });
    }
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch question.', error: err.message });
  }
};

// Update a question by ID (for admin/future use)
exports.updateQuestion = async (req, res) => {
  try {
    const updates = req.body;
    const question = await Question.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!question) {
      return res.status(404).json({ message: 'Question not found.' });
    }
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update question.', error: err.message });
  }
};

// Delete a question by ID (for admin/future use)
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found.' });
    }
    res.json({ message: 'Question deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete question.', error: err.message });
  }
};