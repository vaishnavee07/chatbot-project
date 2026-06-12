import { useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { useAutoScroll } from '../hooks/useAutoScroll';

function EmptyState({ onPrompt }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
      textAlign: 'center',
    }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, color: 'var(--color-text-primary)' }}>
        Welcome to the Course Helpdesk
      </h2>
      <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 24, maxWidth: 400 }}>
        You can ask questions about your course material, request topic explanations, or view available subjects.
      </p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => onPrompt('What courses are available?')}
          style={{
            padding: '8px 16px',
            border: '1px solid var(--color-border)',
            borderRadius: 4,
            background: 'var(--color-bg)',
            color: 'var(--color-text-primary)',
            fontSize: 13,
          }}
        >
          View Available Courses
        </button>
        <button
          onClick={() => onPrompt('Explain DFA and NFA')}
          style={{
            padding: '8px 16px',
            border: '1px solid var(--color-border)',
            borderRadius: 4,
            background: 'var(--color-bg)',
            color: 'var(--color-text-primary)',
            fontSize: 13,
          }}
        >
          Example: Explain DFA
        </button>
      </div>
    </div>
  );
}

export default function ChatWindow({ onSendPrompt }) {
  const { messages, isTyping } = useChat();
  const scrollRef = useAutoScroll([messages.length, isTyping]);

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      background: 'var(--color-bg)',
    }}>
      {messages.length === 0 ? (
        <EmptyState onPrompt={onSendPrompt} />
      ) : (
        <>
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={scrollRef} style={{ height: 1 }} />
        </>
      )}
    </div>
  );
}
