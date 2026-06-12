import { memo } from 'react';
import { parseStructuredMessage } from '../utils/formatMessage';
import CourseTag from './CourseTag';

function renderInlineBold(text) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

function BotContent({ parsed }) {
  if (!parsed.sections || parsed.sections.length === 0) {
    return <p style={{ margin: 0 }}>{renderInlineBold(parsed.raw)}</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {parsed.sections.map((section, i) => {
        if (section.type === 'text') {
          return (
            <p key={i} style={{ margin: 0, lineHeight: 1.6 }}>
              {renderInlineBold(section.text)}
            </p>
          );
        }
        if (section.type === 'bullet-standalone') {
          return (
            <div key={i} style={{ display: 'flex', gap: 6 }}>
              <span>-</span>
              <span>{renderInlineBold(section.text)}</span>
            </div>
          );
        }
        if (section.type === 'section') {
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
              {section.title && (
                <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {section.title}
                </div>
              )}
              {section.content.map((item, j) => {
                if (item.type === 'bullet') {
                  return (
                    <div key={j} style={{ display: 'flex', gap: 6, paddingLeft: 10 }}>
                      <span>-</span>
                      <span style={{ lineHeight: 1.5 }}>{renderInlineBold(item.text)}</span>
                    </div>
                  );
                }
                return (
                  <p key={j} style={{ margin: 0, lineHeight: 1.6 }}>
                    {renderInlineBold(item.text)}
                  </p>
                );
              })}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

const MessageBubble = memo(function MessageBubble({ message }) {
  const { role, text, source } = message;
  const isUser = role === 'user';
  const parsed = isUser ? null : parseStructuredMessage(text);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 16,
      }}
    >
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4, padding: '0 4px' }}>
        {isUser ? 'You' : 'Helpdesk Assistant'}
      </div>
      <div
        style={{
          maxWidth: '80%',
          padding: '12px 16px',
          borderRadius: 4,
          background: isUser ? 'var(--color-user-bubble)' : 'var(--color-bot-bubble)',
          color: 'var(--color-text-primary)',
          border: '1px solid',
          borderColor: isUser ? 'var(--color-user-bubble-border)' : 'var(--color-bot-bubble-border)',
          fontSize: 14,
          lineHeight: 1.6,
          wordBreak: 'break-word',
        }}
      >
        {isUser ? (
          <p style={{ margin: 0 }}>{text}</p>
        ) : (
          <BotContent parsed={parsed} />
        )}
      </div>
      {source && <CourseTag source={source} />}
    </div>
  );
});

export default MessageBubble;
