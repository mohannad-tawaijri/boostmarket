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
  ArrowRight,
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
  CheckCheck,
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
  status?: 'SENT' | 'DELIVERED' | 'READ';
  sender?: User;
  customOffer?: CustomOffer;
}

interface Conversation {
  id: string;
  participants: { user: User }[];
  messages: Message[];
  lastMessage?: Message;
  updatedAt: string;
  service?: { id: string; title: string; boosterId?: string };
  unreadCount?: number;
}

function MessagesContent() {
  const { user } = useAuth();
  const router = useRouter();
  const { isConnected, joinConversation, leaveConversation, onNewMessage, onMessageNotification, onMessageStatusUpdate, onOfferStatusUpdate, markAsRead, refreshUnreadCount, onlineUsers, checkOnlineUsers } = useSocket();
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

  // Check if current user is a booster (by role OR by having services listed)
  const isBooster =
    (user as any)?.role === 'BOOSTER' ||
    ((user as any)?._count?.services ?? 0) > 0 ||
    (user as any)?.boosterProfile !== null;

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

  // Listen for message status updates (delivered/read checkmarks)
  useEffect(() => {
    const unsubscribe = onMessageStatusUpdate((update) => {
      if (activeConversation && update.conversationId === activeConversation.id) {
        setMessages(prev => prev.map(msg => {
          if (update.messageIds && update.messageIds.includes(msg.id)) {
            return { ...msg, status: update.status };
          }
          return msg;
        }));
      }
    });

    return () => unsubscribe();
  }, [activeConversation?.id, onMessageStatusUpdate]);

  // Listen for offer status updates (accepted/declined/cancelled) in real-time
  useEffect(() => {
    const unsubscribe = onOfferStatusUpdate((update) => {
      setMessages(prev => prev.map(msg => {
        if (msg.customOffer?.id === update.offerId) {
          return {
            ...msg,
            customOffer: {
              ...msg.customOffer!,
              status: update.status,
              ...(update.orderId ? { orderId: update.orderId } : {}),
            },
          };
        }
        return msg;
      }));
    });

    return () => unsubscribe();
  }, [onOfferStatusUpdate]);

  // Check online status for all conversation participants
  useEffect(() => {
    if (conversations.length > 0 && user) {
      const participantIds = conversations
        .map(c => c.participants.find(p => p.user.id !== user.id)?.user.id)
        .filter((id): id is string => !!id);
      if (participantIds.length > 0) {
        checkOnlineUsers(participantIds);
      }
    }
  }, [conversations.length, checkOnlineUsers, user]);

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
        alert('يجب أن تكون الصورة أقل من 5 ميجابايت');
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
        // Navigate to checkout page to complete payment
        router.push(`/checkout?orderId=${data.order.id}`);
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
          <h2 className="text-xl font-semibold text-white mb-2">يرجى تسجيل الدخول</h2>
          <p className="text-zinc-400 mb-4">يجب تسجيل الدخول لعرض الرسائل</p>
          <Link href="/login">
            <Button>تسجيل الدخول</Button>
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
                <ArrowRight className="w-4 h-4 me-2" />
                رجوع
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white">الرسائل</h1>
          </div>
          {/* Connection Status */}
          <div className="flex items-center gap-2 text-sm">
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-green-400 hidden sm:inline">متصل</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 hidden sm:inline">جاري الاتصال...</span>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/[0.09] border border-white/[0.15] rounded-xl overflow-hidden flex" style={{ height: 'calc(100vh - 200px)' }}>
          {/* Conversations List */}
          <div className={`w-full md:w-80 border-r border-white/[0.15] flex flex-col ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
            {/* Search */}
            <div className="p-4 border-b border-white/[0.15]">
              <div className="relative">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="ابحث في المحادثات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full ps-10 pe-4 py-2 bg-white/[0.09] border border-white/[0.18] rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
                  <p className="text-zinc-400">لا توجد محادثات بعد</p>
                  <p className="text-zinc-500 text-sm mt-1">تواصل مع بوستر لبدء الدردشة</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => {
                  const other = getOtherParticipant(conversation);
                  const isActive = activeConversation?.id === conversation.id;
                  
                  return (
                    <button
                      key={conversation.id}
                      onClick={() => selectConversation(conversation)}
                      className={`w-full p-4 flex items-center gap-3 hover:bg-white/[0.07] transition-colors border-b border-white/[0.15]/50 ${
                        isActive ? 'bg-zinc-800/70' : ''
                      }`}
                    >
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-violet-600 flex items-center justify-center">
                          <UserIcon className="w-6 h-6 text-white" />
                        </div>
                        {other && onlineUsers.has(other.id) && (
                          <span className="absolute bottom-0 end-0 w-3.5 h-3.5 bg-green-500 border-2 border-zinc-900 rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 text-right overflow-hidden">
                        <p className="text-white font-medium truncate">{other?.name || 'مستخدم'}</p>
                        {conversation.service && (
                          <p className="text-violet-400 text-xs truncate">بخصوص: {conversation.service.title}</p>
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
                <div className="p-4 border-b border-white/[0.15] flex items-center gap-3">
                  <button
                    onClick={() => setActiveConversation(null)}
                    className="md:hidden text-zinc-400 hover:text-white"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                    {getOtherParticipant(activeConversation) && onlineUsers.has(getOtherParticipant(activeConversation)!.id) && (
                      <span className="absolute bottom-0 end-0 w-3 h-3 bg-green-500 border-2 border-zinc-900 rounded-full" />
                    )}
                  </div>
                  <div>
                    <Link href={`/profile/${getOtherParticipant(activeConversation)?.id}`} className="text-white font-medium hover:text-violet-400 transition-colors">
                      {getOtherParticipant(activeConversation)?.name || 'مستخدم'}
                    </Link>
                    {getOtherParticipant(activeConversation) && onlineUsers.has(getOtherParticipant(activeConversation)!.id) ? (
                      <p className="text-green-400 text-xs">متصل</p>
                    ) : activeConversation.service ? (
                      <Link href={`/services/${activeConversation.service.id}`} className="text-violet-400 text-sm hover:underline">
                        {activeConversation.service.title}
                      </Link>
                    ) : (
                      <p className="text-zinc-500 text-xs">غير متصل</p>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-zinc-400">لا توجد رسائل بعد</p>
                      <p className="text-zinc-500 text-sm">أرسل رسالة لبدء المحادثة</p>
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
                                <span className="text-violet-300 font-medium text-sm">عرض مخصص</span>
                                {offer.status !== 'PENDING' && (
                                  <span className={`ms-auto px-2 py-0.5 rounded-full text-xs font-medium ${
                                    offer.status === 'ACCEPTED' ? 'bg-green-500/20 text-green-400' :
                                    offer.status === 'DECLINED' ? 'bg-red-500/20 text-red-400' :
                                    'bg-gray-500/20 text-zinc-400'
                                  }`}>
                                    {offer.status === 'ACCEPTED' ? 'مقبول' : offer.status === 'DECLINED' ? 'مرفوض' : offer.status === 'EXPIRED' ? 'منتهي' : offer.status === 'CANCELLED' ? 'ملغي' : 'قيد الانتظار'}
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
                                    <span className="text-green-400 font-bold text-lg">{offer.price} ر.س</span>
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
                                          <Check className="w-4 h-4 me-1" />
                                          قبول
                                        </>
                                      )}
                                    </Button>
                                    <Button
                                      onClick={() => declineOffer(offer.id)}
                                      disabled={isProcessing}
                                      variant="outline"
                                      className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
                                    >
                                      <XCircle className="w-4 h-4 me-1" />
                                      رفض
                                    </Button>
                                  </div>
                                )}

                                {offer.status === 'ACCEPTED' && offer.orderId && (
                                  <Link href="/orders">
                                    <Button className="w-full bg-green-600/20 text-green-400 hover:bg-green-600/30">
                                      <Check className="w-4 h-4 me-1" />
                                      تم إنشاء الطلب - عرض الطلبات
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
                                  alt="صورة مشاركة" 
                                  className="max-w-full max-h-64 object-contain cursor-pointer hover:opacity-90"
                                />
                              </a>
                            )}
                            {message.content && (
                              <p className={`px-4 py-2 ${message.imageUrl ? 'pt-1' : ''}`}>{message.content}</p>
                            )}
                            <div className={`flex items-center gap-1 px-4 pb-2 ${isOwn ? 'justify-end' : ''}`}>
                              <span className={`text-xs ${isOwn ? 'text-white/60' : 'text-zinc-500'}`}>
                                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {isOwn && (
                                message.status === 'READ' ? (
                                  <CheckCheck className="w-4 h-4 text-sky-300" />
                                ) : message.status === 'DELIVERED' ? (
                                  <CheckCheck className="w-4 h-4 text-white/60" />
                                ) : (
                                  <Check className="w-4 h-4 text-white/60" />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-white/[0.15]">
                  {/* Send Custom Offer Button — only the conversation's service owner */}
                  {isBooster && activeConversation?.service?.boosterId === user?.id && (
                    <div className="mb-3">
                      <button
                        onClick={() => setShowOfferModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl text-sm font-medium transition-all"
                      >
                        <DollarSign className="w-4 h-4" />
                        إرسال عرض مخصص
                      </button>
                    </div>
                  )}

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mb-3 relative inline-block">
                      <img 
                        src={imagePreview} 
                        alt="معاينة" 
                        className="max-h-32 rounded-lg border border-white/[0.18]"
                      />
                      <button
                        onClick={clearSelectedImage}
                        className="absolute -top-2 -end-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
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
                      className="px-3 py-3 bg-white/[0.09] border border-white/[0.18] rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                      title="إرسال صورة"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="اكتب رسالة..."
                      className="flex-1 px-4 py-3 bg-white/[0.09] border border-white/[0.18] rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
                    <p className="text-xs text-violet-400 mt-2">جاري رفع الصورة...</p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-zinc-400">اختر محادثة</p>
                  <p className="text-zinc-500 text-sm">اختر من محادثاتك الحالية أو تواصل مع بوستر</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white/[0.08] border border-white/[0.18] rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/[0.18]">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                إنشاء عرض مخصص
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
                  عنوان العرض *
                </label>
                <input
                  type="text"
                  value={offerForm.title}
                  onChange={(e) => setOfferForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="مثال: تعزيز من ذهبي إلى ماسي"
                  className="w-full px-4 py-3 bg-white/[0.09] border border-white/[0.18] rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  الوصف (اختياري)
                </label>
                <textarea
                  value={offerForm.description}
                  onChange={(e) => setOfferForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="صف ما يتضمنه هذا العرض..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/[0.09] border border-white/[0.18] rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    السعر ($) *
                  </label>
                  <input
                    type="number"
                    value={offerForm.price}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="50"
                    min="1"
                    className="w-full px-4 py-3 bg-white/[0.09] border border-white/[0.18] rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    مدة التسليم *
                  </label>
                  <select
                    value={offerForm.deliveryTime}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, deliveryTime: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#1a1a20] border border-white/[0.18] rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    <option value="1 day" className="bg-[#1a1a20] text-white">يوم واحد</option>
                    <option value="1-2 days" className="bg-[#1a1a20] text-white">1-2 أيام</option>
                    <option value="2-3 days" className="bg-[#1a1a20] text-white">2-3 أيام</option>
                    <option value="3-5 days" className="bg-[#1a1a20] text-white">3-5 أيام</option>
                    <option value="1 week" className="bg-[#1a1a20] text-white">أسبوع واحد</option>
                    <option value="2 weeks" className="bg-[#1a1a20] text-white">أسبوعين</option>
                  </select>
                </div>
              </div>

              <div className="bg-white/[0.07] rounded-xl p-3 text-sm text-zinc-400">
                <p>💡 سيتم إرسال هذا العرض كرسالة. يمكن للمشتري قبوله أو رفضه.</p>
                <p className="mt-1">إذا تم القبول، سيتم إنشاء طلب تلقائيًا.</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-4 border-t border-white/[0.18]">
              <Button
                variant="outline"
                onClick={() => setShowOfferModal(false)}
                className="flex-1"
              >
                إلغاء
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
                    <Send className="w-4 h-4 me-2" />
                    إرسال العرض
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
