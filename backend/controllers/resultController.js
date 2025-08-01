// backend/controllers/resultController.js

const Result = require('../models/Result');
const Question = require('../models/Question');
const Exam = require('../models/Exam');

// Start an exam attempt
exports.startExam = async (req, res) => {
  try {
    const { examId } = req.body;
    if (!examId) {
      return res.status(400).json({ message: 'Exam ID is required.' });
    }
    // Check if exam exists and is active
    const exam = await Exam.findById(examId);
    if (!exam || !exam.isActive) {
      return res.status(404).json({ message: 'Exam not found or inactive.' });
    }
    // Prevent duplicate attempts (optional: allow multiple attempts if needed)
    const existing = await Result.findOne({ studentId: req.user.id, examId, submittedAt: { $exists: false } });
    if (existing) {
      return res.status(400).json({ message: 'Exam already started and not submitted.' });
    }
    const result = await Result.create({
      studentId: req.user.id,
      examId,
      startedAt: new Date(),
      answers: []
    });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to start exam.', error: err.message });
  }
};

// Submit answers for an exam attempt
exports.submitExam = async (req, res) => {
  try {
    const { resultId, answers } = req.body;
    if (!resultId || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Result ID and answers are required.' });
    }
    const result = await Result.findById(resultId);
    if (!result) {
      return res.status(404).json({ message: 'Result not found.' });
    }
    if (result.submittedAt) {
      return res.status(400).json({ message: 'Exam already submitted.' });
    }
    // Fetch exam questions
    const exam = await Exam.findById(result.examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found.' });
    }
    const questionDocs = await Question.find({ _id: { $in: exam.questionIds } });
    // Calculate score and detailed report
    let score = 0, correct = 0, incorrect = 0, unanswered = 0;
    const answerMap = {};
    answers.forEach(a => { answerMap[a.questionId] = a.selectedOption; });
    const answerResults = exam.questionIds.map(qid => {
      const q = questionDocs.find(q => q._id.equals(qid));
      if (!q) {
        unanswered++;
        return { questionId: qid, selectedOption: null, isCorrect: false };
      }
      const selected = answerMap[qid.toString()];
      if (selected == null) {
        unanswered++;
        return { questionId: qid, selectedOption: null, isCorrect: false };
      }
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) {
        score++;
        correct++;
      } else {
        incorrect++;
      }
      return { questionId: qid, selectedOption: selected, isCorrect };
    });
    const percentage = (score / exam.questionIds.length) * 100;
    result.answers = answerResults;
    result.score = score;
    result.percentage = percentage;
    result.detailedReport = { correct, incorrect, unanswered };
    result.submittedAt = new Date();
    await result.save();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit exam.', error: err.message });
  }
};

// Get all results for the current student
exports.getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.user.id }).populate('examId');
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch results.', error: err.message });
  }
};

// Get a specific result by ID (must belong to current student)
exports.getResultById = async (req, res) => {
  try {
    const result = await Result.findOne({ _id: req.params.id, studentId: req.user.id }).populate('examId');
    if (!result) {
      return res.status(404).json({ message: 'Result not found.' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch result.', error: err.message });
  }
};