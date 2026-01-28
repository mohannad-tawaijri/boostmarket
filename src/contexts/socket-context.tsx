'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './auth-context';
import { showMessageNotification } from '@/components/toast-notification';

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface MessageNotification {
  conversationId: string;
  message: Message;
  from: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  unreadCount: number;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendMessage: (conversationId: string, content: string) => void;
  markAsRead: (conversationId: string) => void;
  onNewMessage: (callback: (message: Message) => void) => () => void;
  refreshUnreadCount: () => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

// Get WebSocket URL (direct to backend, not through proxy)
const getWsUrl = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    return 'https://boost-api-16ta.onrender.com';
  }
  return 'http://localhost:3001';
};

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messageCallbacks, setMessageCallbacks] = useState<((message: Message) => void)[]>([]);

  // Fetch unread count from API
  const fetchUnreadCount = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001';
      const response = await fetch(`${API_URL}/chat/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const count = await response.json();
        setUnreadCount(count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) return;

    // Fetch initial unread count
    fetchUnreadCount();

    // Connect to WebSocket
    const newSocket = io(getWsUrl(), {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('newMessage', (message: Message) => {
      messageCallbacks.forEach(callback => callback(message));
    });

    newSocket.on('messageNotification', (notification: MessageNotification) => {
      // Increment unread count
      setUnreadCount(prev => prev + 1);
      
      const senderName = notification.from?.name || 'Someone';
      const messageContent = notification.message?.content || 'Sent you a message';
      
      // Show in-app toast notification (always works)
      showMessageNotification({
        senderName: senderName,
        senderAvatar: notification.from?.avatar,
        message: messageContent,
        conversationId: notification.conversationId,
        senderId: notification.from?.id || '',
      });
      
      // Also show browser notification if permitted and page is not focused
      if (Notification.permission === 'granted') {
        try {
          const browserNotification = new Notification(`${senderName}`, {
            body: messageContent.substring(0, 100),
            icon: '/icon.png',
            tag: `message-${notification.conversationId}`, // Prevents duplicate notifications
          });
          
          // Close notification after 5 seconds
          setTimeout(() => browserNotification.close(), 5000);
          
          // Click to focus the window
          browserNotification.onclick = () => {
            window.focus();
            browserNotification.close();
          };
        } catch (e) {
          // Browser notification failed, in-app toast still works
          console.log('Browser notification not available');
        }
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Request notification permission
  useEffect(() => {
    if (user && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [user]);

  const joinConversation = useCallback((conversationId: string) => {
    socket?.emit('joinConversation', conversationId);
  }, [socket]);

  const leaveConversation = useCallback((conversationId: string) => {
    socket?.emit('leaveConversation', conversationId);
  }, [socket]);

  const sendMessage = useCallback((conversationId: string, content: string) => {
    socket?.emit('sendMessage', { conversationId, content });
  }, [socket]);

  const markAsRead = useCallback((conversationId: string) => {
    socket?.emit('markAsRead', conversationId);
    // Refresh unread count after marking as read
    fetchUnreadCount();
  }, [socket, fetchUnreadCount]);

  const onNewMessage = useCallback((callback: (message: Message) => void) => {
    setMessageCallbacks(prev => [...prev, callback]);
    return () => {
      setMessageCallbacks(prev => prev.filter(cb => cb !== callback));
    };
  }, []);

  return (
    <SocketContext.Provider value={{
      socket,
      isConnected,
      unreadCount,
      joinConversation,
      leaveConversation,
      sendMessage,
      markAsRead,
      onNewMessage,
      refreshUnreadCount: fetchUnreadCount,
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
