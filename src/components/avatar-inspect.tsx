'use client';

import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

interface AvatarInspectProps {
  src: string;
  alt: string;
  children: React.ReactNode;
}

export default function AvatarInspect({ src, alt, children }: AvatarInspectProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-full"
        aria-label={`عرض صورة ${alt}`}
      >
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-4 end-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            aria-label="إغلاق"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[90vw] max-h-[85vh] rounded-2xl object-contain shadow-2xl animate-in zoom-in-90 duration-200"
          />
        </div>
      )}
    </>
  );
}
