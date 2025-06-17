import { useEffect, useRef, useCallback } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { CloudEvent } from '../types';
import { useApp } from '../contexts/AppContext';

export function useWebSocket() {
  const { addEvent, setConnected, setError } = useApp();
  const wsRef = useRef<ReconnectingWebSocket | null>(null);
  const isConnectedRef = useRef(false);
  const reconnectIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const connectRef = useRef<(() => void) | undefined>(undefined);

  const startReconnectInterval = useCallback(() => {
    if (reconnectIntervalRef.current) {
      console.log('Reconnection interval already running, skipping');
      return; // Already running
    }
    
    console.log('Starting reconnection attempts every 1 second');
    reconnectIntervalRef.current = setInterval(() => {
      if (!isConnectedRef.current && connectRef.current) {
        console.log('Attempting to reconnect...');
        connectRef.current();
      } else if (isConnectedRef.current) {
        // Stop if somehow we got connected but didn't stop the interval
        console.log('Connected detected, stopping reconnection interval');
        if (reconnectIntervalRef.current) {
          clearInterval(reconnectIntervalRef.current);
          reconnectIntervalRef.current = null;
        }
      }
    }, 1000);
  }, []);

  const stopReconnectInterval = useCallback(() => {
    if (reconnectIntervalRef.current) {
      console.log('Stopping reconnection attempts');
      clearInterval(reconnectIntervalRef.current);
      reconnectIntervalRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    console.log('Connect called, current state:', wsRef.current?.readyState);
    
    // Don't reconnect if already connected or connecting
    if (isConnectedRef.current || (wsRef.current && wsRef.current.readyState === WebSocket.CONNECTING)) {
      console.log('Already connected or connecting, skipping');
      return;
    }

    // Close existing connection if any
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    try {
      const wsUrl = `ws://localhost:8080/ws`;
      console.log('Connecting to:', wsUrl);

      wsRef.current = new ReconnectingWebSocket(wsUrl, [], {
        maxReconnectionDelay: 10000,
        minReconnectionDelay: 1000,
        reconnectionDelayGrowFactor: 1.3,
        connectionTimeout: 4000,
        maxRetries: Infinity,
        debug: true
      });

      wsRef.current.onopen = () => {
        console.log('WebSocket connected successfully');
        isConnectedRef.current = true;
        setConnected(true);
        setError(null);
        stopReconnectInterval(); // Stop trying to reconnect
      };

      wsRef.current.onmessage = (event) => {
        try {
          let data = event.data;
          let parseAttempts = 0;
          const maxAttempts = 3;
          
          // Parse JSON if it's a string - handle multiple encoding levels
          while (typeof data === 'string' && parseAttempts < maxAttempts) {
            try {
              const parsed = JSON.parse(data);
              parseAttempts++;
              
              if (typeof parsed === 'string' && parsed === data) {
                break;
              }
              
              data = parsed;
              
              // If we got an object, stop parsing
              if (typeof data === 'object' && data !== null) {
                break;
              }
            } catch (parseErr) {
              console.error('JSON parse error:', parseErr);
              break;
            }
          }
          
          // Validate it's a proper CloudEvent object
          if (data && typeof data === 'object' && !Array.isArray(data) && data !== null) {
            console.log('📨 Received CloudEvent:', data.id, data.type);
            addEvent(data as CloudEvent);
          } else {
            console.warn('Invalid CloudEvent format:', typeof data);
          }
        } catch (err) {
          console.error('WebSocket message processing error:', err);
          setError('Failed to parse incoming message');
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket disconnected, code:', event.code, 'reason:', event.reason);
        isConnectedRef.current = false;
        setConnected(false);
        startReconnectInterval(); // Start trying to reconnect
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        isConnectedRef.current = false;
        setError('WebSocket connection error');
        startReconnectInterval(); // Start trying to reconnect on error
      };

    } catch (err) {
      console.error('Failed to create WebSocket connection:', err);
      setError('Failed to create WebSocket connection');
      startReconnectInterval(); // Start trying to reconnect on failure
    }
  }, [addEvent, setConnected, setError, startReconnectInterval, stopReconnectInterval]);

  const disconnect = useCallback(() => {
    console.log('Disconnect called');
    stopReconnectInterval(); // Stop auto-reconnection when manually disconnecting
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    isConnectedRef.current = false;
    setConnected(false);
  }, [setConnected, stopReconnectInterval]);

  // Update the connect ref
  connectRef.current = connect;

  useEffect(() => {
    return () => {
      stopReconnectInterval();
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [stopReconnectInterval]);

  return { connect, disconnect };
}