'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode, useRef } from 'react';
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

interface MessageStatusUpdate {
  conversationId: string;
  messageIds?: string[];
  status: 'DELIVERED' | 'READ';
  readBy?: string;
}

interface OfferStatusUpdate {
  offerId: string;
  status: 'ACCEPTED' | 'DECLINED' | 'CANCELLED';
  orderId?: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  unreadCount: number;
  onlineUsers: Set<string>;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendMessage: (conversationId: string, content: string) => void;
  markAsRead: (conversationId: string) => void;
  onNewMessage: (callback: (message: Message) => void) => () => void;
  onMessageNotification: (callback: (notification: MessageNotification) => void) => () => void;
  onMessageStatusUpdate: (callback: (update: MessageStatusUpdate) => void) => () => void;
  onOfferStatusUpdate: (callback: (update: OfferStatusUpdate) => void) => () => void;
  refreshUnreadCount: () => void;
  checkOnlineUsers: (userIds: string[]) => void;
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
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  // Use ref to avoid stale closure issues with socket event handlers
  const messageCallbacksRef = useRef<((message: Message) => void)[]>([]);
  const notificationCallbacksRef = useRef<((notification: MessageNotification) => void)[]>([]);
  const statusCallbacksRef = useRef<((update: MessageStatusUpdate) => void)[]>([]);
  const offerStatusCallbacksRef = useRef<((update: OfferStatusUpdate) => void)[]>([]);

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
      console.log('Received newMessage:', message);
      messageCallbacksRef.current.forEach(callback => callback(message));
    });

    newSocket.on('messageNotification', (notification: MessageNotification) => {
      // Increment unread count
      setUnreadCount(prev => prev + 1);
      
      // Call all notification callbacks (for messages page to update badges)
      notificationCallbacksRef.current.forEach(callback => callback(notification));
      
      const senderName = notification.from?.name || 'Someone';
      const messageContent = notification.message?.content || 'Sent you a message';
      
      // Don't show notifications if user is on the messages page
      const isOnMessagesPage = typeof window !== 'undefined' && window.location.pathname === '/messages';
      const popupsEnabled = localStorage.getItem('showMessagePopups') !== 'false';

      if (!isOnMessagesPage) {
        // Show in-app toast notification (if user hasn't disabled it)
        if (popupsEnabled) {
          showMessageNotification({
            senderName: senderName,
            senderAvatar: notification.from?.avatar,
            message: messageContent,
            conversationId: notification.conversationId,
            senderId: notification.from?.id || '',
          });
        }

        // Also show browser notification if permitted and page is not focused
        if (Notification.permission === 'granted') {
          try {
            const browserNotification = new Notification(`${senderName}`, {
              body: messageContent.substring(0, 100),
              icon: '/icon.png',
              tag: `message-${notification.conversationId}`,
            });
            
            setTimeout(() => browserNotification.close(), 5000);
            
            browserNotification.onclick = () => {
              window.focus();
              browserNotification.close();
            };
          } catch (e) {
            console.log('Browser notification not available');
          }
        }
      }
    });

    // Online/offline presence tracking
    newSocket.on('userOnline', ({ userId }: { userId: string }) => {
      setOnlineUsers(prev => new Set(prev).add(userId));
    });

    newSocket.on('userOffline', ({ userId }: { userId: string }) => {
      setOnlineUsers(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    // Message status updates (delivered/read)
    newSocket.on('messageStatusUpdate', (update: MessageStatusUpdate) => {
      statusCallbacksRef.current.forEach(callback => callback(update));
    });

    // Offer status updates (accepted/declined/cancelled)
    newSocket.on('offerStatusUpdate', (update: OfferStatusUpdate) => {
      offerStatusCallbacksRef.current.forEach(callback => callback(update));
    });

    // Response for getOnlineUsers request
    newSocket.on('onlineUsersList', (userIds: string[]) => {
      setOnlineUsers(new Set(userIds));
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
    messageCallbacksRef.current = [...messageCallbacksRef.current, callback];
    return () => {
      messageCallbacksRef.current = messageCallbacksRef.current.filter(cb => cb !== callback);
    };
  }, []);

  const onMessageNotification = useCallback((callback: (notification: MessageNotification) => void) => {
    notificationCallbacksRef.current = [...notificationCallbacksRef.current, callback];
    return () => {
      notificationCallbacksRef.current = notificationCallbacksRef.current.filter(cb => cb !== callback);
    };
  }, []);

  const onMessageStatusUpdate = useCallback((callback: (update: MessageStatusUpdate) => void) => {
    statusCallbacksRef.current = [...statusCallbacksRef.current, callback];
    return () => {
      statusCallbacksRef.current = statusCallbacksRef.current.filter(cb => cb !== callback);
    };
  }, []);

  const onOfferStatusUpdate = useCallback((callback: (update: OfferStatusUpdate) => void) => {
    offerStatusCallbacksRef.current = [...offerStatusCallbacksRef.current, callback];
    return () => {
      offerStatusCallbacksRef.current = offerStatusCallbacksRef.current.filter(cb => cb !== callback);
    };
  }, []);

  const checkOnlineUsers = useCallback((userIds: string[]) => {
    socket?.emit('getOnlineUsers', userIds);
  }, [socket]);

  return (
    <SocketContext.Provider value={{
      socket,
      isConnected,
      unreadCount,
      onlineUsers,
      joinConversation,
      leaveConversation,
      sendMessage,
      markAsRead,
      onNewMessage,
      onMessageNotification,
      onMessageStatusUpdate,
      onOfferStatusUpdate,
      refreshUnreadCount: fetchUnreadCount,
      checkOnlineUsers,
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
