import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div style={{ padding: 40, maxWidth: 800, margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: 24 }}>
        <Link to="/" style={{ color: 'var(--color-primary, #3b82f6)', textDecoration: 'none' }}>
          &larr; Back to Chat
        </Link>
      </div>
      
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16, color: 'var(--color-text-primary)' }}>
        About AI Course Helpdesk
      </h1>
      
      <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        The AI Course Helpdesk is an intelligent assistant designed to help students learn and understand course concepts more effectively. By leveraging modern Information Retrieval (IR) and AI techniques, the helpdesk searches through verified course materials to provide accurate and contextual explanations.
      </p>

      <h2 style={{ fontSize: 24, fontWeight: 600, marginTop: 32, marginBottom: 16, color: 'var(--color-text-primary)' }}>
        Key Features
      </h2>
      
      <ul style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--color-text-secondary)', paddingLeft: 20 }}>
        <li><strong>Contextual Understanding:</strong> Answers are derived directly from course materials, ensuring relevance and accuracy.</li>
        <li><strong>Recent Searches & Sessions:</strong> Keep track of your past questions and seamlessly pick up where you left off.</li>
        <li><strong>Export Chat:</strong> Save your conversations for offline reading and study.</li>
      </ul>

      <h2 style={{ fontSize: 24, fontWeight: 600, marginTop: 32, marginBottom: 16, color: 'var(--color-text-primary)' }}>
        Technical Stack
      </h2>
      
      <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        Built with React and Vite on the frontend, and FastAPI with Faiss (Facebook AI Similarity Search) and Sentence Transformers on the backend.
      </p>
    </div>
  );
}
