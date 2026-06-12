export default function CourseTag({ source }) {
  if (!source) return null;
  return (
    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 8, fontStyle: 'italic' }}>
      Source: {source}
    </div>
  );
}
