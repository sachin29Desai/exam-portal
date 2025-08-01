// backend/controllers/studentController.js

const Student = require('../models/Student');

exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-passwordHash');
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile.', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password || updates.passwordHash) {
      return res.status(400).json({ message: 'Password cannot be updated here.' });
    }
    updates.updatedAt = new Date();
    const student = await Student.findByIdAndUpdate(req.user.id, updates, { new: true, select: '-passwordHash' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile.', error: err.message });
  }
};