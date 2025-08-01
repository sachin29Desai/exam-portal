// backend/models/Exam.js

const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  durationMinutes: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exam', examSchema);