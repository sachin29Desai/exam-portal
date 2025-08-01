// backend/models/Question.js

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  choices: [
    {
      option: { type: String, required: true }, // e.g., "A"
      label: { type: String, required: true }   // e.g., "Option text"
    }
  ],
  correctAnswer: { type: String, required: true }, // e.g., "A"
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', questionSchema);