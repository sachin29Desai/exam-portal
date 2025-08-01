// backend/routes/result.js

const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const auth = require('../middleware/auth');

// Start an exam attempt
router.post('/start', auth, resultController.startExam);

// Submit answers for an exam attempt
router.post('/submit', auth, resultController.submitExam);

// Get all results for the current student
router.get('/my', auth, resultController.getMyResults);

// Get a specific result by ID (must belong to current student)
router.get('/:id', auth, resultController.getResultById);

module.exports = router;