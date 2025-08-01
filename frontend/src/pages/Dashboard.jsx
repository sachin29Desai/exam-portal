import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/exams', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) {
          throw new Error('Failed to fetch exams');
        }
        const data = await res.json();
        setExams(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Student info, available exams, and past results will be shown here.</p>
      <h2>Available Exams</h2>
      {loading && <p>Loading exams...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <ul>
          {exams.length === 0 && <li>No exams available.</li>}
          {exams.map(exam => (
            <li key={exam._id}>
              <strong>{exam.title}</strong> ({exam.durationMinutes} min)
              <br />
              {exam.description}
              <br />
              <Link to={`/exam/${exam._id}`}>
                <button>Start Exam</button>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <div style={{ marginTop: 32 }}>
        <Link to="/results">
          <button>View My Results</button>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;