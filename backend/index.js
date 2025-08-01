// backend/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const studentRoutes = require('./routes/student');
app.use('/api/students', studentRoutes);

const questionRoutes = require('./routes/question');
// Exam routes
const examRoutes = require('./routes/exam');
app.use('/api/exams', examRoutes);

// Result routes
const resultRoutes = require('./routes/result');
app.use('/api/results', resultRoutes);

app.use('/api/questions', questionRoutes);

// Simple root route
app.get('/', (req, res) => {
  res.send('Student Exam App Backend is running.');
});

// MongoDB connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student_exam_app';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  // Start server only after DB connection
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});