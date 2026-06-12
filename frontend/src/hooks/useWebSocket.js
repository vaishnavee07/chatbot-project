import { useEffect, useRef, useCallback } from 'react';
import { useChat } from '../context/ChatContext';

const WS_URL = 'ws://localhost:8000/ws';
const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1500;

export function useWebSocket() {
  const { addMessage, setIsTyping, setWsStatus } = useChat();

  const wsRef = useRef(null);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef(null);
  const connectRef = useRef(null);

  const handleMessage = useCallback((event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.type === 'typing') {
        setIsTyping(data.value);
        return;
      }

      if (data.type === 'message') {
        addMessage({
          role: data.role,
          text: data.text,
          source: data.source || null,
          intent: data.intent || null,
        });
        return;
      }

      if (data.type === 'error') {
        addMessage({
          role: 'bot',
          text: `Error: ${data.text}`,
          source: null,
          intent: 'error',
        });
      }
    } catch {
      // ignore malformed messages
    }
  }, [addMessage, setIsTyping]);

  useEffect(() => {
    function connect() {
      if (wsRef.current) {
        wsRef.current.onopen = null;
        wsRef.current.onclose = null;
        wsRef.current.onerror = null;
        wsRef.current.onmessage = null;
        if (wsRef.current.readyState < WebSocket.CLOSING) {
          wsRef.current.close(1000);
        }
        wsRef.current = null;
      }

      clearTimeout(retryTimerRef.current);
      setWsStatus('connecting');

      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        retryCountRef.current = 0;
        setWsStatus('connected');
      };

      ws.onclose = (event) => {
        if (wsRef.current !== ws) return;
        wsRef.current = null;
        setIsTyping(false);
        setWsStatus('disconnected');

        if (event.code !== 1000 && retryCountRef.current < MAX_RETRIES) {
          const delay = BASE_DELAY_MS * Math.pow(1.8, retryCountRef.current);
          retryCountRef.current += 1;
          retryTimerRef.current = setTimeout(connect, delay);
        }
      };

      ws.onerror = () => {
        setWsStatus('error');
      };

      ws.onmessage = handleMessage;
    }

    connectRef.current = connect;
    connect();

    return () => {
      clearTimeout(retryTimerRef.current);
      if (wsRef.current) {
        wsRef.current.onopen = null;
        wsRef.current.onclose = null;
        wsRef.current.onerror = null;
        wsRef.current.onmessage = null;
        wsRef.current.close(1000);
        wsRef.current = null;
      }
    };
  }, [handleMessage, setIsTyping, setWsStatus]);

  const sendMessage = useCallback((text) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return false;
    wsRef.current.send(JSON.stringify({ type: 'message', text }));
    return true;
  }, []);

  return { sendMessage };
}
