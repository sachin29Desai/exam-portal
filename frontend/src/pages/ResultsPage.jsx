import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function ResultsPage() {
  const { resultId } = useParams();
  const [results, setResults] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (resultId) {
      // Fetch a specific result
      setLoading(true);
      setError(null);
      fetch(`/api/results/${resultId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch result');
          return res.json();
        })
        .then(data => setResult(data))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    } else {
      // Fetch all results
      setLoading(true);
      setError(null);
      fetch('/api/results/my', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch results');
          return res.json();
        })
        .then(data => setResults(data))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [resultId]);

  if (loading) return <div>Loading results...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  if (resultId && result) {
    // Detailed result view
    return (
      <div>
        <h1>Exam Result</h1>
        <p><strong>Exam:</strong> {result.examId?.title || 'Exam'}</p>
        <p><strong>Score:</strong> {result.score ?? '-'} / {result.answers?.length ?? '-'}</p>
        <p><strong>Percentage:</strong> {result.percentage != null ? result.percentage.toFixed(2) + '%' : '-'}</p>
        {result.detailedReport && (
          <p>
            <strong>Correct:</strong> {result.detailedReport.correct}, <strong>Incorrect:</strong> {result.detailedReport.incorrect}, <strong>Unanswered:</strong> {result.detailedReport.unanswered}
          </p>
        )}
        <p><strong>Started:</strong> {result.startedAt ? new Date(result.startedAt).toLocaleString() : '-'}</p>
        <p><strong>Submitted:</strong> {result.submittedAt ? new Date(result.submittedAt).toLocaleString() : '-'}</p>
        <h3>Answers</h3>
        <ul>
          {result.answers?.map((ans, idx) => (
            <li key={ans.questionId || idx}>
              Q: {ans.questionId} <br />
              Selected: {ans.selectedOption ?? 'Unanswered'} <br />
              {ans.isCorrect ? <span style={{ color: 'green' }}>Correct</span> : <span style={{ color: 'red' }}>Incorrect</span>}
            </li>
          ))}
        </ul>
        <Link to="/results">
          <button>Back to All Results</button>
        </Link>
      </div>
    );
  }

  // List all results
  return (
    <div>
      <h1>Exam Results</h1>
      <ul>
        {results.length === 0 && <li>No results found.</li>}
        {results.map(result => (
          <li key={result._id}>
            <strong>{result.examId?.title || 'Exam'}</strong> - Score: {result.score ?? '-'} / {result.answers?.length ?? '-'}
            <br />
            {result.percentage != null && <>Percentage: {result.percentage.toFixed(2)}%</>}
            <br />
            {result.detailedReport && (
              <span>
                Correct: {result.detailedReport.correct}, Incorrect: {result.detailedReport.incorrect}, Unanswered: {result.detailedReport.unanswered}
              </span>
            )}
            <br />
            Started: {result.startedAt ? new Date(result.startedAt).toLocaleString() : '-'}
            <br />
            Submitted: {result.submittedAt ? new Date(result.submittedAt).toLocaleString() : '-'}
            <br />
            <Link to={`/results/${result._id}`}>
              <button>View Result</button>
            </Link>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 32 }}>
        <Link to="/dashboard">
          <button>Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
}

export default ResultsPage;