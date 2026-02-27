'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface Toast {
  id: string;
  type: 'message' | 'info' | 'success' | 'error';
  title: string;
  body: string;
  link?: string;
  avatar?: string;
  senderId?: string;
  conversationId?: string;
}

let addToastExternal: ((toast: Omit<Toast, 'id'>) => void) | null = null;

export function showMessageNotification(data: {
  senderName: string;
  senderAvatar?: string;
  message: string;
  conversationId: string;
  senderId: string;
}) {
  if (addToastExternal) {
    addToastExternal({
      type: 'message',
      title: data.senderName,
      body: data.message.length > 80 ? data.message.substring(0, 80) + '...' : data.message,
      link: `/messages`,
      avatar: data.senderAvatar,
      senderId: data.senderId,
      conversationId: data.conversationId,
    });
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Expose addToast externally
  useEffect(() => {
    addToastExternal = addToast;
    return () => {
      addToastExternal = null;
    };
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 start-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-white/[0.05] border border-white/[0.12] rounded-xl shadow-xl p-4 animate-slide-in"
        >
          <div className="flex items-start gap-3">
            {/* Avatar or Icon */}
            {toast.type === 'message' ? (
              <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0">
                {toast.avatar ? (
                  <img src={toast.avatar} alt="" className="w-10 h-10 rounded-full" />
                ) : (
                  <span className="text-white font-semibold">{toast.title.charAt(0).toUpperCase()}</span>
                )}
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm">{toast.title}</p>
              <p className="text-zinc-400 text-sm truncate">{toast.body}</p>
              {toast.link && (
                <Link
                  href={toast.link}
                  onClick={() => removeToast(toast.id)}
                  className="text-violet-400 text-xs hover:underline mt-1 inline-block"
                >
                  فتح المحادثة ←
                </Link>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-500 hover:text-white flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
