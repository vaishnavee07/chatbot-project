import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function StatisticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/stats')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: 24 }}>
        <Link to="/" style={{ color: 'var(--color-primary, #3b82f6)', textDecoration: 'none' }}>
          &larr; Back to Chat
        </Link>
      </div>

      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24, color: 'var(--color-text-primary)' }}>
        Project Statistics
      </h1>

      {loading ? (
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading statistics...</p>
      ) : error ? (
        <div style={{ padding: 16, background: '#fee2e2', color: '#991b1b', borderRadius: 8 }}>
          Failed to load statistics: {error}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
          <div style={{ padding: 24, background: '#f9fafb', border: '1px solid var(--color-border)', borderRadius: 8 }}>
            <h3 style={{ fontSize: 14, textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: 8, marginTop: 0 }}>
              Total Courses
            </h3>
            <p style={{ fontSize: 36, fontWeight: 700, color: 'var(--color-primary, #3b82f6)', margin: 0 }}>
              {stats.total_courses}
            </p>
          </div>
          
          <div style={{ padding: 24, background: '#f9fafb', border: '1px solid var(--color-border)', borderRadius: 8 }}>
            <h3 style={{ fontSize: 14, textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: 8, marginTop: 0 }}>
              Total Documents (Chunks)
            </h3>
            <p style={{ fontSize: 36, fontWeight: 700, color: 'var(--color-primary, #3b82f6)', margin: 0 }}>
              {stats.total_documents}
            </p>
          </div>

          <div style={{ padding: 24, background: '#f9fafb', border: '1px solid var(--color-border)', borderRadius: 8 }}>
            <h3 style={{ fontSize: 14, textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: 8, marginTop: 0 }}>
              Vector Store Status
            </h3>
            <p style={{ fontSize: 24, fontWeight: 700, color: stats.vector_store_ready ? '#16a34a' : '#dc2626', margin: 0, marginTop: 8 }}>
              {stats.vector_store_ready ? 'Ready' : 'Not Ready'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
