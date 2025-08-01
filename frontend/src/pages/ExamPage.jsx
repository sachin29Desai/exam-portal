import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ExamPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [resultId, setResultId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Start exam attempt and fetch exam details
  useEffect(() => {
    const startExam = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        // Start exam attempt
        const startRes = await fetch('/api/results/start', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ examId })
        });
        if (!startRes.ok) throw new Error('Failed to start exam');
        const startData = await startRes.json();
        setResultId(startData._id);

        // Fetch exam details
        const examRes = await fetch(`/api/exams/${examId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!examRes.ok) throw new Error('Failed to fetch exam');
        const examData = await examRes.json();
        setExam(examData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    startExam();
  }, [examId]);

  const handleOptionChange = (qid, option) => {
    setAnswers(prev => ({ ...prev, [qid]: option }));
  };

  const handlePrev = () => setCurrent(c => Math.max(0, c - 1));
  const handleNext = () => setCurrent(c => Math.min((exam?.questionIds?.length || 1) - 1, c + 1));

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const answerArr = (exam.questionIds || []).map(qid => ({
        questionId: qid,
        selectedOption: answers[qid] ?? null
      }));
      const res = await fetch('/api/results/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ resultId, answers: answerArr })
      });
      if (!res.ok) throw new Error('Failed to submit exam');
      setSubmitted(true);
      // Optionally, redirect to results page
      const data = await res.json();
      navigate(`/results/${data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading exam...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!exam) return <div>Exam not found.</div>;
  if (submitted) return <div>Exam submitted! Redirecting to results...</div>;

  const questions = exam.questions || exam.questionIds || [];
  const currentQid = questions[current]?._id || questions[current];
  const currentQuestion = questions[current]?.text
    ? questions[current]
    : (exam.questions?.find(q => q._id === currentQid) || {});

  return (
    <div>
      <h1>{exam.title}</h1>
      <div>
        <h2>Question {current + 1} of {questions.length}</h2>
        <p>{currentQuestion.text}</p>
        <ul>
          {(currentQuestion.choices || []).map(option => (
            <li key={option}>
              <label>
                <input
                  type="radio"
                  name={`q_${currentQid}`}
                  value={option}
                  checked={answers[currentQid] === option}
                  onChange={() => handleOptionChange(currentQid, option)}
                  disabled={submitting}
                />
                {option}
              </label>
            </li>
          ))}
        </ul>
        <div>
          <button onClick={handlePrev} disabled={current === 0 || submitting}>Previous</button>
          <button onClick={handleNext} disabled={current === questions.length - 1 || submitting}>Next</button>
        </div>
        <div style={{ marginTop: 20 }}>
          <button onClick={handleSubmit} disabled={submitting}>Submit Exam</button>
        </div>
      </div>
    </div>
  );
}

export default ExamPage;