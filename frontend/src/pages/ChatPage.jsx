import { useCallback } from 'react';
import ConnectionStatus from '../components/ConnectionStatus';
import ChatWindow from '../components/ChatWindow';
import InputBar from '../components/InputBar';
import Sidebar from '../components/Sidebar';
import { useChat } from '../context/ChatContext';
import { useWebSocket } from '../hooks/useWebSocket';

export default function ChatPage() {
  const { addMessage } = useChat();
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
      <Sidebar onPrompt={handlePrompt} />

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
