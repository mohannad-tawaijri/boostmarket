"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";
import { Button } from "./ui/button";
import { User, Message, Conversation } from "@/types";
import { API_URL } from "@/lib/config";

interface ChatBoxProps {
  otherUser: User;
  serviceId?: string;
  onClose: () => void;
}

export default function ChatBox({ otherUser, serviceId, onClose }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeChat = async () => {
    try {
      const token = localStorage.getItem("authToken");
      
      // Create or get conversation
      const convResponse = await fetch(`${API_URL}/chat/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          otherUserId: otherUser.id,
          serviceId,
        }),
      });
      const convData = await convResponse.json();
      setConversation(convData);

      // Get messages
      const messagesResponse = await fetch(
        `${API_URL}/chat/conversations/${convData.id}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const messagesData = await messagesResponse.json();
      setMessages(messagesData);
    } catch (error) {
      console.error("Error initializing chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversation) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${API_URL}/chat/conversations/${conversation.id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newMessage }),
        }
      );
      const message = await response.json();
      setMessages([...messages, message]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 start-4 w-96 bg-[#141418] rounded-xl shadow-2xl shadow-black/40 z-50 flex flex-col max-h-[600px] border border-white/[0.06]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/[0.06] rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-violet-600/20 rounded-full flex items-center justify-center text-violet-400 font-medium text-sm">
            {otherUser.name?.charAt(0) || "U"}
          </div>
          <div>
            <p className="font-medium text-white text-sm">{otherUser.name}</p>
            <p className="text-xs text-zinc-500">متصل</p>
          </div>
        </div>
        <button onClick={onClose} className="hover:bg-white/[0.06] p-1.5 rounded-md transition-colors">
          <X className="w-4 h-4 text-zinc-400" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/20">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-violet-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            <p className="text-sm">لا توجد رسائل بعد.</p>
            <p className="text-xs mt-1 text-zinc-600">ابدأ المحادثة!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isMine = message.sender?.id !== otherUser.id;
            return (
              <div
                key={message.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-3.5 py-2 ${
                    isMine
                      ? "bg-violet-600 text-white"
                      : "bg-zinc-800 text-zinc-200"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isMine ? "text-violet-200" : "text-zinc-500"
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/[0.06] rounded-b-xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="اكتب رسالة..."
            className="flex-1 bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
          />
          <Button onClick={sendMessage} disabled={!newMessage.trim()} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
