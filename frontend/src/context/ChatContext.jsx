import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [sessions, setSessions] = useLocalStorage('acha_sessions', []);
  const [currentSessionId, setCurrentSessionId] = useLocalStorage('acha_current_session_id', null);
  const [recentSearches, setRecentSearches] = useLocalStorage('acha_recent_searches', []);
  
  const [isTyping, setIsTyping] = useState(false);
  const [wsStatus, setWsStatus] = useState('disconnected');

  useEffect(() => {
    if (sessions.length === 0) {
      const newSessionId = Date.now().toString();
      setSessions([{ id: newSessionId, title: 'New Conversation', messages: [] }]);
      setCurrentSessionId(newSessionId);
    } else if (!currentSessionId || !sessions.find(s => s.id === currentSessionId)) {
      setCurrentSessionId(sessions[0].id);
    }
  }, [sessions, currentSessionId, setSessions, setCurrentSessionId]);

  const currentSession = useMemo(() => {
    return sessions.find(s => s.id === currentSessionId) || { messages: [] };
  }, [sessions, currentSessionId]);

  const messages = currentSession.messages;

  const createNewSession = useCallback(() => {
    const newSessionId = Date.now().toString();
    setSessions(prev => [
      { id: newSessionId, title: 'New Conversation', messages: [] },
      ...prev
    ]);
    setCurrentSessionId(newSessionId);
  }, [setSessions, setCurrentSessionId]);

  const addMessage = useCallback((message) => {
    const msg = { id: Date.now() + Math.random(), timestamp: Date.now(), ...message };
    
    if (message.role === 'user') {
      setRecentSearches(prev => {
        const text = message.text.trim();
        if (!text) return prev;
        return [text, ...prev.filter(t => t !== text)].slice(0, 5);
      });
    }

    setSessions(prev => prev.map(session => {
      if (session.id === currentSessionId) {
        let newTitle = session.title;
        // Set title on first user message
        if (session.messages.length <= 1 && message.role === 'user') {
          newTitle = message.text.slice(0, 30) + (message.text.length > 30 ? '...' : '');
        }
        return { ...session, title: newTitle, messages: [...session.messages, msg] };
      }
      return session;
    }));
  }, [currentSessionId, setSessions, setRecentSearches]);

  const clearChat = useCallback(() => {
    setSessions(prev => prev.map(session => {
      if (session.id === currentSessionId) {
        return { ...session, messages: [] };
      }
      return session;
    }));
  }, [currentSessionId, setSessions]);

  const deleteSession = useCallback((id) => {
    setSessions(prev => {
      const newSessions = prev.filter(s => s.id !== id);
      if (currentSessionId === id && newSessions.length > 0) {
        setCurrentSessionId(newSessions[0].id);
      }
      return newSessions;
    });
  }, [currentSessionId, setSessions, setCurrentSessionId]);

  return (
    <ChatContext.Provider value={{
      sessions,
      currentSessionId,
      recentSearches,
      messages,
      isTyping,
      wsStatus,
      addMessage,
      clearChat,
      setIsTyping,
      setWsStatus,
      setCurrentSessionId,
      createNewSession,
      deleteSession
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
