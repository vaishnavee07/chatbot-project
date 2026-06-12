export default function TypingIndicator() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '10px 14px',
      background: 'var(--color-bot-bubble)',
      border: '1px solid var(--color-bot-bubble-border)',
      borderRadius: 'var(--radius-lg)',
      borderBottomLeftRadius: 4,
      width: 'fit-content',
      color: 'var(--color-text-secondary)',
      fontSize: 13,
      fontStyle: 'italic',
    }}>
      Typing...
    </div>
  );
}
