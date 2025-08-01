// backend/routes/question.js

const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const auth = require('../middleware/auth');

// For now, all routes are open; restrict to admin in future

// Create a new question
router.post('/', auth, questionController.createQuestion);

// Get all questions
router.get('/', auth, questionController.getAllQuestions);

// Get a single question by ID
router.get('/:id', auth, questionController.getQuestionById);

// Update a question by ID
router.put('/:id', auth, questionController.updateQuestion);

// Delete a question by ID
router.delete('/:id', auth, questionController.deleteQuestion);

module.exports = router;