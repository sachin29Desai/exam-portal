// backend/routes/student.js

const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../middleware/auth');

// GET /api/students/me - Get current student profile
router.get('/me', auth, studentController.getProfile);

// PUT /api/students/me - Update profile/settings
router.put('/me', auth, studentController.updateProfile);

module.exports = router;