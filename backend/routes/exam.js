// backend/routes/exam.js

const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const auth = require('../middleware/auth');

// Create a new exam
router.post('/', auth, examController.createExam);

// Get all exams
router.get('/', auth, examController.getAllExams);

// Get a single exam by ID
router.get('/:id', auth, examController.getExamById);

// Update an exam by ID
router.put('/:id', auth, examController.updateExam);

// Delete an exam by ID
router.delete('/:id', auth, examController.deleteExam);

module.exports = router;