// backend/models/Student.js

const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  settings: {
    theme: { type: String, default: 'light' },
    notifications: { type: Boolean, default: true }
  }
});

module.exports = mongoose.model('Student', studentSchema);