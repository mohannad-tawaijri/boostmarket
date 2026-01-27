'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useSocket } from '@/contexts/socket-context';
import { Button } from '@/components/ui/button';
import { API_URL } from '@/lib/config';
import { 
  MessageSquare, 
  Send, 
  ArrowLeft,
  Loader2,
  User as UserIcon,
  Search,
  Wifi,
  WifiOff,
  Image as ImageIcon,
  X
} from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface Message {
  id: string;
  content?: string;
  imageUrl?: string;
  senderId: string;
  createdAt: string;
  sender?: User;
}

interface Conversation {
  id: string;
  participants: { user: User }[];
  messages: Message[];
  lastMessage?: Message;
  updatedAt: string;
  service?: { id: string; title: string };
}

function MessagesContent() {
  const { user } = useAuth();
  const { isConnected, joinConversation, leaveConversation, onNewMessage, markAsRead, refreshUnreadCount } = useSocket();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check for userId param to start new conversation
  const targetUserId = searchParams.get('userId');
  const serviceId = searchParams.get('serviceId');

  useEffect(() => {
    fetchConversations();
  }, []);

  // Handle WebSocket real-time messages
  useEffect(() => {
    const unsubscribe = onNewMessage((message: Message) => {
      // Check if this message is for the active conversation
      if (activeConversation) {
        setMessages(prev => {
          // Avoid duplicates
          if (prev.some(m => m.id === message.id)) return prev;
          return [...prev, message];
        });
      }
      // Refresh conversation list to update last message
      fetchConversations();
    });

    return () => unsubscribe();
  }, [activeConversation, onNewMessage]);

  // Join/leave conversation room when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      joinConversation(activeConversation.id);
      markAsRead(activeConversation.id);
      
      return () => {
        leaveConversation(activeConversation.id);
      };
    }
  }, [activeConversation?.id, joinConversation, leaveConversation, markAsRead]);

  useEffect(() => {
    // Only start new conversation if we have a valid targetUserId
    if (targetUserId && targetUserId !== 'undefined' && user && targetUserId !== user.id) {
      startNewConversation(targetUserId, serviceId && serviceId !== 'undefined' ? serviceId : undefined);
    }
  }, [targetUserId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const startNewConversation = async (otherUserId: string, serviceId?: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/chat/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otherUserId, serviceId }),
      });
      
      if (response.ok) {
        const conversation = await response.json();
        setActiveConversation(conversation);
        await loadMessages(conversation.id);
        await fetchConversations(); // Refresh list
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/chat/conversations/${conversationId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const selectConversation = async (conversation: Conversation) => {
    setActiveConversation(conversation);
    await loadMessages(conversation.id);
    markAsRead(conversation.id);
    refreshUnreadCount();
    // Clear any pending image when switching conversations
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB');
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const token = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/upload/image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.url;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
    return null;
  };

  const sendMessage = async () => {
    if ((!newMessage.trim() && !selectedImage) || !activeConversation || sendingMessage) return;

    setSendingMessage(true);
    const token = localStorage.getItem('authToken');

    try {
      let imageUrl: string | undefined;

      // Upload image first if selected
      if (selectedImage) {
        setUploadingImage(true);
        const uploadedUrl = await uploadImage(selectedImage);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
        setUploadingImage(false);
      }

      const response = await fetch(
        `${API_URL}/chat/conversations/${activeConversation.id}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            content: newMessage.trim() || undefined, 
            imageUrl 
          }),
        }
      );

      if (response.ok) {
        const message = await response.json();
        setMessages(prev => {
          // Avoid duplicates (WebSocket might have already added it)
          if (prev.some(m => m.id === message.id)) return prev;
          return [...prev, message];
        });
        setNewMessage('');
        clearSelectedImage();
        await fetchConversations(); // Update last message in list
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
      setUploadingImage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getOtherParticipant = (conversation: Conversation): User | null => {
    const otherParticipant = conversation.participants.find(
      p => p.user.id !== user?.id
    );
    return otherParticipant?.user || null;
  };

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const other = getOtherParticipant(conv);
    return other?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Please log in</h2>
          <p className="text-gray-400 mb-4">You need to be logged in to view messages</p>
          <Link href="/login">
            <Button>Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white">Messages</h1>
          </div>
          {/* Connection Status */}
          <div className="flex items-center gap-2 text-sm">
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-green-400 hidden sm:inline">Live</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 hidden sm:inline">Connecting...</span>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex" style={{ height: 'calc(100vh - 200px)' }}>
          {/* Conversations List */}
          <div className={`w-full md:w-80 border-r border-slate-800 flex flex-col ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
            {/* Search */}
            <div className="p-4 border-b border-slate-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No conversations yet</p>
                  <p className="text-gray-500 text-sm mt-1">Contact a booster to start chatting</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => {
                  const other = getOtherParticipant(conversation);
                  const isActive = activeConversation?.id === conversation.id;
                  
                  return (
                    <button
                      key={conversation.id}
                      onClick={() => selectConversation(conversation)}
                      className={`w-full p-4 flex items-center gap-3 hover:bg-slate-800/50 transition-colors border-b border-slate-800/50 ${
                        isActive ? 'bg-slate-800/70' : ''
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <UserIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 text-left overflow-hidden">
                        <p className="text-white font-medium truncate">{other?.name || 'User'}</p>
                        {conversation.service && (
                          <p className="text-indigo-400 text-xs truncate">Re: {conversation.service.title}</p>
                        )}
                        {conversation.lastMessage && (
                          <p className="text-gray-500 text-sm truncate">{conversation.lastMessage.content}</p>
                        )}
                      </div>
                      <span className="text-gray-600 text-xs">
                        {new Date(conversation.updatedAt).toLocaleDateString()}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-800 flex items-center gap-3">
                  <button
                    onClick={() => setActiveConversation(null)}
                    className="md:hidden text-gray-400 hover:text-white"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {getOtherParticipant(activeConversation)?.name || 'User'}
                    </p>
                    {activeConversation.service && (
                      <Link href={`/services/${activeConversation.service.id}`} className="text-indigo-400 text-sm hover:underline">
                        {activeConversation.service.title}
                      </Link>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">No messages yet</p>
                      <p className="text-gray-500 text-sm">Send a message to start the conversation</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isOwn = message.senderId === user.id;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl overflow-hidden ${
                              isOwn
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                : 'bg-slate-800 text-gray-200'
                            }`}
                          >
                            {message.imageUrl && (
                              <a href={message.imageUrl} target="_blank" rel="noopener noreferrer">
                                <img 
                                  src={message.imageUrl} 
                                  alt="Shared image" 
                                  className="max-w-full max-h-64 object-contain cursor-pointer hover:opacity-90"
                                />
                              </a>
                            )}
                            {message.content && (
                              <p className={`px-4 py-2 ${message.imageUrl ? 'pt-1' : ''}`}>{message.content}</p>
                            )}
                            <p className={`text-xs px-4 pb-2 ${isOwn ? 'text-white/60' : 'text-gray-500'}`}>
                              {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-slate-800">
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mb-3 relative inline-block">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-h-32 rounded-lg border border-slate-700"
                      />
                      <button
                        onClick={clearSelectedImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    {/* Hidden file input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    {/* Image upload button */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-3 bg-slate-800 border border-slate-700 rounded-xl text-gray-400 hover:text-white hover:bg-slate-700 transition-colors"
                      title="Send image"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <Button 
                      onClick={sendMessage} 
                      disabled={(!newMessage.trim() && !selectedImage) || sendingMessage}
                      className="px-4"
                    >
                      {sendingMessage ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                  {uploadingImage && (
                    <p className="text-xs text-indigo-400 mt-2">Uploading image...</p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Select a conversation</p>
                  <p className="text-gray-500 text-sm">Choose from your existing chats or contact a booster</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}
