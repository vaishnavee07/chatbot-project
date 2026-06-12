import { useCallback } from 'react';
import { Trash2, PlusCircle, MessageSquare } from 'lucide-react';
import ConnectionStatus from '../components/ConnectionStatus';
import ChatWindow from '../components/ChatWindow';
import InputBar from '../components/InputBar';
import { useChat } from '../context/ChatContext';
import { useWebSocket } from '../hooks/useWebSocket';

export default function ChatPage() {
  const { clearChat, addMessage, sessions, currentSessionId, setCurrentSessionId, createNewSession, deleteSession } = useChat();
  const { sendMessage } = useWebSocket();

  const handleSend = useCallback((text) => {
    addMessage({ role: 'user', text });
    const sent = sendMessage(text);
    if (!sent) {
      setTimeout(() => {
        addMessage({
          role: 'bot',
          text: 'Error: Could not send message to server.',
          source: null,
          intent: 'error',
        });
      }, 200);
    }
  }, [addMessage, sendMessage]);

  const handlePrompt = useCallback((text) => {
    handleSend(text);
  }, [handleSend]);

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      width: '100%',
      background: 'var(--color-bg)',
    }}>
      {/* Simple Left Sidebar */}
      <aside style={{
        width: 250,
        minWidth: 250,
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: 24,
        background: '#f9fafb',
      }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px 0', color: 'var(--color-text-primary)' }}>
            AI Course Helpdesk
          </h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0 }}>
            Student Academic Project
          </p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-secondary)', margin: 0 }}>
              Recent Chats
            </h2>
            <button onClick={createNewSession} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center' }} title="New Chat">
              <PlusCircle size={16} />
            </button>
          </div>
          <ul style={{ listStyleType: 'none', padding: 0, margin: '0 0 24px 0' }}>
            {sessions.map(session => (
              <li key={session.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px', marginBottom: 4, borderRadius: 4, cursor: 'pointer',
                background: currentSessionId === session.id ? '#e5e7eb' : 'transparent',
                color: currentSessionId === session.id ? '#111827' : 'var(--color-text-secondary)',
              }} onClick={() => setCurrentSessionId(session.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                  <MessageSquare size={14} />
                  <span style={{ fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {session.title || 'New Conversation'}
                  </span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center' }}
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>

          <h2 style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: 12 }}>
            Available Courses
          </h2>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0, fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 2 }}>
            <li>- Advanced Java</li>
            <li>- AIML Oracle Academy</li>
            <li>- Aptitude</li>
            <li>- Compiler Design</li>
            <li>- Computer Networks</li>
            <li>- Financial Management</li>
            <li>- Software Engineering</li>
          </ul>
        </div>

        <button
          onClick={clearChat}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--color-border)',
            borderRadius: 4,
            fontSize: 13,
            color: 'var(--color-text-primary)',
            background: 'var(--color-bg)',
            marginTop: 24,
            cursor: 'pointer',
          }}
        >
          Clear Current Chat
        </button>
      </aside>

      {/* Main Chat Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-chat-bg)',
      }}>
        <ConnectionStatus />
        <ChatWindow onSendPrompt={handlePrompt} />
        <InputBar onSend={handleSend} />
      </div>
    </div>
  );
}
