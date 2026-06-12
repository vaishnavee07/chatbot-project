import { createContext, useContext, useState, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [messages, setMessages] = useLocalStorage('acha_messages', []);
  const [isTyping, setIsTyping] = useState(false);
  const [wsStatus, setWsStatus] = useState('disconnected');

  const addMessage = useCallback((message) => {
    const msg = { id: Date.now() + Math.random(), timestamp: Date.now(), ...message };
    setMessages(prev => [...prev, msg]);
  }, [setMessages]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  return (
    <ChatContext.Provider value={{
      messages,
      isTyping,
      wsStatus,
      addMessage,
      clearChat,
      setIsTyping,
      setWsStatus,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};
