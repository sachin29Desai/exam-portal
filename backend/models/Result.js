// backend/models/Result.js

const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  selectedOption: { type: String, required: true },
  isCorrect: { type: Boolean, required: true }
}, { _id: false });

const resultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  startedAt: { type: Date, required: true },
  submittedAt: { type: Date },
  answers: [answerSchema],
  score: { type: Number },
  percentage: { type: Number },
  detailedReport: {
    correct: { type: Number, default: 0 },
    incorrect: { type: Number, default: 0 },
    unanswered: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model('Result', resultSchema);