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
  X,
  DollarSign,
  Clock,
  Check,
  XCircle,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

interface CustomOffer {
  id: string;
  title: string;
  description?: string;
  price: number;
  deliveryTime: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | 'CANCELLED';
  senderId: string;
  receiverId: string;
  orderId?: string;
  expiresAt?: string;
}

interface Message {
  id: string;
  content?: string;
  imageUrl?: string;
  senderId: string;
  createdAt: string;
  sender?: User;
  customOffer?: CustomOffer;
}

interface Conversation {
  id: string;
  participants: { user: User }[];
  messages: Message[];
  lastMessage?: Message;
  updatedAt: string;
  service?: { id: string; title: string };
  unreadCount?: number;
}

function MessagesContent() {
  const { user } = useAuth();
  const router = useRouter();
  const { isConnected, joinConversation, leaveConversation, onNewMessage, onMessageNotification, markAsRead, refreshUnreadCount } = useSocket();
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
  
  // Custom Offer Modal State
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    price: '',
    deliveryTime: '1-2 days'
  });
  const [sendingOffer, setSendingOffer] = useState(false);
  const [processingOffer, setProcessingOffer] = useState<string | null>(null);

  // Check if current user is a booster
  const isBooster = (user as any)?.role === 'BOOSTER';

  // Check for userId param to start new conversation
  const targetUserId = searchParams.get('userId');
  const serviceId = searchParams.get('serviceId');

  useEffect(() => {
    fetchConversations();
  }, []);

  // Handle WebSocket real-time messages
  useEffect(() => {
    const unsubscribe = onNewMessage((message: Message) => {
      const messageConversationId = (message as any).conversationId;
      
      // Check if this message belongs to the active conversation
      if (activeConversation && messageConversationId === activeConversation.id) {
        setMessages(prev => {
          // Avoid duplicates
          if (prev.some(m => m.id === message.id)) return prev;
          return [...prev, message];
        });
        // Mark as read immediately since user is viewing this conversation
        markAsRead(activeConversation.id);
      } else if (messageConversationId) {
        // Message is for a different conversation - increment its unread count locally
        setConversations(prev => prev.map(c => 
          c.id === messageConversationId 
            ? { ...c, unreadCount: (c.unreadCount || 0) + 1 } 
            : c
        ));
      }
      // Refresh conversation list to update last message and ensure sync
      fetchConversations();
    });

    return () => unsubscribe();
  }, [activeConversation?.id, onNewMessage, markAsRead]);

  // Listen for message notifications (updates badges even without entering a conversation)
  useEffect(() => {
    const unsubscribe = onMessageNotification((notification) => {
      const conversationId = notification.conversationId;
      
      // If the notification is for the active conversation, don't increment badge
      if (activeConversation && conversationId === activeConversation.id) {
        return;
      }
      
      // Update the unread count for this conversation
      setConversations(prev => prev.map(c => 
        c.id === conversationId 
          ? { ...c, unreadCount: (c.unreadCount || 0) + 1 } 
          : c
      ));
      
      // Also refresh to get updated last message
      fetchConversations();
    });

    return () => unsubscribe();
  }, [activeConversation?.id, onMessageNotification]);

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
    // Immediately update local state to clear unread badge for this conversation
    setConversations(prev => prev.map(c => 
      c.id === conversation.id ? { ...c, unreadCount: 0 } : c
    ));
    await loadMessages(conversation.id);
    markAsRead(conversation.id);
    refreshUnreadCount();
    // Refresh conversations to update unread count in the list
    fetchConversations();
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

  const sendCustomOffer = async () => {
    if (!activeConversation || !offerForm.title || !offerForm.price) return;
    
    setSendingOffer(true);
    const token = localStorage.getItem('authToken');
    const otherUser = getOtherParticipant(activeConversation);
    
    if (!otherUser) {
      setSendingOffer(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/custom-offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: offerForm.title,
          description: offerForm.description || undefined,
          price: parseFloat(offerForm.price),
          deliveryTime: offerForm.deliveryTime,
          receiverId: otherUser.id,
          conversationId: activeConversation.id,
          serviceId: activeConversation.service?.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Add the message with offer to messages list
        setMessages(prev => {
          if (prev.some(m => m.id === data.message.id)) return prev;
          return [...prev, data.message];
        });
        // Reset form and close modal
        setOfferForm({ title: '', description: '', price: '', deliveryTime: '1-2 days' });
        setShowOfferModal(false);
        await fetchConversations();
      }
    } catch (error) {
      console.error('Error sending custom offer:', error);
    } finally {
      setSendingOffer(false);
    }
  };

  const acceptOffer = async (offerId: string) => {
    setProcessingOffer(offerId);
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(`${API_URL}/custom-offers/${offerId}/accept`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Update the message with the new offer status
        setMessages(prev => prev.map(m => 
          m.customOffer?.id === offerId 
            ? { ...m, customOffer: { ...m.customOffer!, status: 'ACCEPTED', orderId: data.order.id } }
            : m
        ));
        // Navigate to orders page
        router.push('/orders');
      }
    } catch (error) {
      console.error('Error accepting offer:', error);
    } finally {
      setProcessingOffer(null);
    }
  };

  const declineOffer = async (offerId: string) => {
    setProcessingOffer(offerId);
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(`${API_URL}/custom-offers/${offerId}/decline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Update the message with the new offer status
        setMessages(prev => prev.map(m => 
          m.customOffer?.id === offerId 
            ? { ...m, customOffer: { ...m.customOffer!, status: 'DECLINED' } }
            : m
        ));
      }
    } catch (error) {
      console.error('Error declining offer:', error);
    } finally {
      setProcessingOffer(null);
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
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Please log in</h2>
          <p className="text-zinc-400 mb-4">You need to be logged in to view messages</p>
          <Link href="/login">
            <Button>Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
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
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden flex" style={{ height: 'calc(100vh - 200px)' }}>
          {/* Conversations List */}
          <div className={`w-full md:w-80 border-r border-white/[0.06] flex flex-col ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
            {/* Search */}
            <div className="p-4 border-b border-white/[0.06]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-zinc-400">No conversations yet</p>
                  <p className="text-zinc-500 text-sm mt-1">Contact a booster to start chatting</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => {
                  const other = getOtherParticipant(conversation);
                  const isActive = activeConversation?.id === conversation.id;
                  
                  return (
                    <button
                      key={conversation.id}
                      onClick={() => selectConversation(conversation)}
                      className={`w-full p-4 flex items-center gap-3 hover:bg-white/[0.04] transition-colors border-b border-white/[0.06]/50 ${
                        isActive ? 'bg-zinc-800/70' : ''
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0">
                        <UserIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 text-left overflow-hidden">
                        <p className="text-white font-medium truncate">{other?.name || 'User'}</p>
                        {conversation.service && (
                          <p className="text-violet-400 text-xs truncate">Re: {conversation.service.title}</p>
                        )}
                        {conversation.lastMessage && (
                          <p className="text-zinc-500 text-sm truncate">{conversation.lastMessage.content}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-gray-600 text-xs">
                          {new Date(conversation.updatedAt).toLocaleDateString()}
                        </span>
                        {!isActive && conversation.unreadCount !== undefined && conversation.unreadCount > 0 && (
                          <span className="bg-violet-600 text-white text-xs font-medium rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                            {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                          </span>
                        )}
                      </div>
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
                <div className="p-4 border-b border-white/[0.06] flex items-center gap-3">
                  <button
                    onClick={() => setActiveConversation(null)}
                    className="md:hidden text-zinc-400 hover:text-white"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {getOtherParticipant(activeConversation)?.name || 'User'}
                    </p>
                    {activeConversation.service && (
                      <Link href={`/services/${activeConversation.service.id}`} className="text-violet-400 text-sm hover:underline">
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
                      <p className="text-zinc-400">No messages yet</p>
                      <p className="text-zinc-500 text-sm">Send a message to start the conversation</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isOwn = message.senderId === user.id;
                      
                      // Custom Offer Card
                      if (message.customOffer) {
                        const offer = message.customOffer;
                        const canRespond = offer.receiverId === user.id && offer.status === 'PENDING';
                        const isProcessing = processingOffer === offer.id;
                        
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className="max-w-[85%] bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-indigo-500/50 overflow-hidden">
                              {/* Offer Header */}
                              <div className="bg-violet-600/20 px-4 py-2 border-b border-violet-500/20 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-violet-400" />
                                <span className="text-violet-300 font-medium text-sm">Custom Offer</span>
                                {offer.status !== 'PENDING' && (
                                  <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${
                                    offer.status === 'ACCEPTED' ? 'bg-green-500/20 text-green-400' :
                                    offer.status === 'DECLINED' ? 'bg-red-500/20 text-red-400' :
                                    'bg-gray-500/20 text-zinc-400'
                                  }`}>
                                    {offer.status}
                                  </span>
                                )}
                              </div>
                              
                              {/* Offer Content */}
                              <div className="p-4">
                                <h4 className="text-white font-semibold mb-2">{offer.title}</h4>
                                {offer.description && (
                                  <p className="text-zinc-400 text-sm mb-3">{offer.description}</p>
                                )}
                                
                                <div className="flex items-center gap-4 mb-4">
                                  <div className="flex items-center gap-1.5">
                                    <DollarSign className="w-4 h-4 text-green-400" />
                                    <span className="text-green-400 font-bold text-lg">${offer.price}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-violet-400" />
                                    <span className="text-zinc-300 text-sm">{offer.deliveryTime}</span>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                {canRespond && (
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => acceptOffer(offer.id)}
                                      disabled={isProcessing}
                                      className="flex-1 bg-green-600 hover:bg-green-500"
                                    >
                                      {isProcessing ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <>
                                          <Check className="w-4 h-4 mr-1" />
                                          Accept
                                        </>
                                      )}
                                    </Button>
                                    <Button
                                      onClick={() => declineOffer(offer.id)}
                                      disabled={isProcessing}
                                      variant="outline"
                                      className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
                                    >
                                      <XCircle className="w-4 h-4 mr-1" />
                                      Decline
                                    </Button>
                                  </div>
                                )}

                                {offer.status === 'ACCEPTED' && offer.orderId && (
                                  <Link href="/orders">
                                    <Button className="w-full bg-green-600/20 text-green-400 hover:bg-green-600/30">
                                      <Check className="w-4 h-4 mr-1" />
                                      Order Created - View Orders
                                    </Button>
                                  </Link>
                                )}
                              </div>
                              
                              <div className="px-4 pb-2">
                                <p className="text-xs text-zinc-500">
                                  {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      
                      // Regular Message
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl overflow-hidden ${
                              isOwn
                                ? 'bg-violet-600 text-white'
                                : 'bg-zinc-800 text-gray-200'
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
                            <p className={`text-xs px-4 pb-2 ${isOwn ? 'text-white/60' : 'text-zinc-500'}`}>
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
                <div className="p-4 border-t border-white/[0.06]">
                  {/* Send Custom Offer Button (for boosters only) */}
                  {isBooster && (
                    <div className="mb-3">
                      <button
                        onClick={() => setShowOfferModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl text-sm font-medium transition-all"
                      >
                        <DollarSign className="w-4 h-4" />
                        Send Custom Offer
                      </button>
                    </div>
                  )}

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mb-3 relative inline-block">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-h-32 rounded-lg border border-white/[0.08]"
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
                      className="px-3 py-3 bg-white/[0.06] border border-white/[0.08] rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
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
                      className="flex-1 px-4 py-3 bg-white/[0.06] border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
                    <p className="text-xs text-violet-400 mt-2">Uploading image...</p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-zinc-400">Select a conversation</p>
                  <p className="text-zinc-500 text-sm">Choose from your existing chats or contact a booster</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/[0.08]">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                Create Custom Offer
              </h3>
              <button
                onClick={() => setShowOfferModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Offer Title *
                </label>
                <input
                  type="text"
                  value={offerForm.title}
                  onChange={(e) => setOfferForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Gold to Diamond Boost"
                  className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={offerForm.description}
                  onChange={(e) => setOfferForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what's included in this offer..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    value={offerForm.price}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="50"
                    min="1"
                    className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    Delivery Time *
                  </label>
                  <select
                    value={offerForm.deliveryTime}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, deliveryTime: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.08] rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    <option value="1 day">1 day</option>
                    <option value="1-2 days">1-2 days</option>
                    <option value="2-3 days">2-3 days</option>
                    <option value="3-5 days">3-5 days</option>
                    <option value="1 week">1 week</option>
                    <option value="2 weeks">2 weeks</option>
                  </select>
                </div>
              </div>

              <div className="bg-white/[0.04] rounded-xl p-3 text-sm text-zinc-400">
                <p>💡 This offer will be sent as a message. The buyer can accept or decline.</p>
                <p className="mt-1">If accepted, an order will be created automatically.</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-4 border-t border-white/[0.08]">
              <Button
                variant="outline"
                onClick={() => setShowOfferModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={sendCustomOffer}
                disabled={!offerForm.title || !offerForm.price || sendingOffer}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
              >
                {sendingOffer ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Offer
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}
