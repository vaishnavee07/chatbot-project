import { useChat } from '../context/ChatContext';

const STATUS_MESSAGES = {
  connected: null,
  connecting: 'Connecting to server...',
  disconnected: 'Disconnected. Reconnecting...',
  error: 'Connection error.',
};

export default function ConnectionStatus() {
  const { wsStatus } = useChat();
  const message = STATUS_MESSAGES[wsStatus];

  if (!message || wsStatus === 'connected') return null;

  return (
    <div style={{
      padding: '8px 24px',
      background: '#fffbeb',
      borderBottom: '1px solid #fde68a',
      color: '#b45309',
      fontSize: 13,
      textAlign: 'center',
    }}>
      {message}
    </div>
  );
}
