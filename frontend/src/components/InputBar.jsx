import { useState, useRef, useCallback } from 'react';
import { useChat } from '../context/ChatContext';

export default function InputBar({ onSend }) {
  const { isTyping, wsStatus } = useChat();
  const [text, setText] = useState('');
  const textareaRef = useRef(null);
  const disabled = isTyping || wsStatus !== 'connected';

  const handleInput = (e) => {
    setText(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    }
  };

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    const ta = textareaRef.current;
    if (ta) ta.style.height = 'auto';
  }, [text, disabled, onSend]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{
      padding: '16px 24px',
      background: 'var(--color-bg)',
      borderTop: '1px solid var(--color-border)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 12,
      }}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKey}
          placeholder={
            disabled && wsStatus !== 'connected'
              ? 'Disconnected from server...'
              : isTyping
                ? 'Waiting for response...'
                : 'Type your message here...'
          }
          disabled={disabled}
          rows={1}
          style={{
            flex: 1,
            resize: 'none',
            fontSize: 14,
            lineHeight: 1.5,
            padding: '10px 12px',
            border: '1px solid var(--color-input-border)',
            borderRadius: 4,
            color: 'var(--color-text-primary)',
            background: 'var(--color-input-bg)',
            maxHeight: 120,
            overflowY: 'auto',
          }}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          style={{
            height: 42,
            padding: '0 20px',
            borderRadius: 4,
            border: '1px solid var(--color-border)',
            background: text.trim() && !disabled ? '#e5e7eb' : 'var(--color-bg)',
            color: 'var(--color-text-primary)',
            fontSize: 14,
            fontWeight: 600,
            cursor: text.trim() && !disabled ? 'pointer' : 'not-allowed',
            opacity: disabled ? 0.6 : 1,
          }}
        >
          Send
        </button>
      </div>
      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8, textAlign: 'center' }}>
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
}
