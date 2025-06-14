
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

export const useWebSocketFallback = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const { user } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    if (user && !('PushManager' in window)) {
      // Use WebSocket fallback for browsers without push notification support
      connectWebSocket();
    }

    return () => {
      disconnect();
    };
  }, [user]);

  const connectWebSocket = () => {
    try {
      // Create WebSocket connection to Supabase realtime
      const wsUrl = `wss://sdixiznvjjaerbrhdifu.supabase.co/realtime/v1/websocket?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkaXhpem52amphZXJicmhkaWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MjE2MzAsImV4cCI6MjA2NTQ5NzYzMH0.KaBKbhu_VlQ2kuooTaVbkdPLFxgjQYqzzfZZxAR0nWM`;
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        reconnectAttempts.current = 0;
        
        // Join the user's notification channel
        if (wsRef.current && user) {
          wsRef.current.send(JSON.stringify({
            topic: `user:${user.id}`,
            event: 'phx_join',
            payload: {},
            ref: Date.now()
          }));
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('WebSocket message received:', message);
          
          setLastMessage({
            type: message.event || 'unknown',
            data: message.payload || message,
            timestamp: Date.now()
          });

          // Handle different message types
          if (message.event === 'delivery_update') {
            showFallbackNotification(message.payload);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        scheduleReconnect();
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      scheduleReconnect();
    }
  };

  const scheduleReconnect = () => {
    if (reconnectAttempts.current < maxReconnectAttempts) {
      const delay = Math.pow(2, reconnectAttempts.current) * 1000; // Exponential backoff
      
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectAttempts.current++;
        console.log(`Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`);
        connectWebSocket();
      }, delay);
    } else {
      toast({
        title: "Connection Failed",
        description: "Unable to maintain real-time connection. Some features may be limited.",
        variant: "destructive"
      });
    }
  };

  const showFallbackNotification = (data: any) => {
    // Show browser notification as fallback
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(data.title || 'Delivery Update', {
        body: data.message || 'You have a new delivery update',
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    } else {
      // Show toast notification as last resort
      toast({
        title: data.title || 'Delivery Update',
        description: data.message || 'You have a new delivery update'
      });
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setIsConnected(false);
  };

  const sendMessage = (message: any) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return {
    isConnected,
    lastMessage,
    sendMessage,
    disconnect
  };
};
