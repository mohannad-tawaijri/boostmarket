'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Lock,
  Shield,
  ArrowRight,
  Gamepad2,
  Check,
} from 'lucide-react';

// Extend window to include Moyasar
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Moyasar: any;
  }
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [moyasarReady, setMoyasarReady] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // In a real app, pull these from cart context / route params
  const orderId = searchParams.get('orderId') || 'demo-order';
  const orderData = {
    service: 'Diamond Rank Boost',
    game: 'League of Legends',
    booster: 'ProBooster123',
    price: 89.99,           // in SAR
    deliveryTime: '2-3 days',
    options: ['VPN Protection', 'Offline Mode'],
  };

  // Amount in halalas (SAR × 100)
  const amountInHalalas = Math.round(orderData.price * 100);

  // Load Moyasar CSS + JS from CDN
  useEffect(() => {
    // CSS
    if (!document.getElementById('moyasar-css')) {
      const link = document.createElement('link');
      link.id = 'moyasar-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.moyasar.com/mpf/1.7.3/moyasar.css';
      document.head.appendChild(link);
    }

    // JS
    if (!document.getElementById('moyasar-js')) {
      const script = document.createElement('script');
      script.id = 'moyasar-js';
      script.src = 'https://cdn.moyasar.com/mpf/1.7.3/moyasar.js';
      script.async = true;
      script.onload = () => setMoyasarReady(true);
      document.head.appendChild(script);
    } else if (window.Moyasar) {
      setMoyasarReady(true);
    }
  }, []);

  // Init Moyasar form once SDK is ready and div is mounted
  useEffect(() => {
    if (!moyasarReady || !formRef.current || initialized.current) return;
    initialized.current = true;

    const callbackBase =
      typeof window !== 'undefined' ? window.location.origin : 'https://boostmarket.app';

    window.Moyasar.init({
      element: '.mysr-form',
      amount: amountInHalalas,
      currency: 'SAR',
      description: `${orderData.service} - ${orderData.game}`,
      publishable_api_key: process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY_HERE',
      callback_url: `${callbackBase}/payment/callback?orderId=${orderId}`,
      methods: ['creditcard'],
      supported_networks: ['mada', 'visa', 'mastercard', 'amex'],
      on_completed: function (payment: { id: string; status: string }) {
        console.log('Payment completed', payment);
      },
    });
  }, [moyasarReady, amountInHalalas, orderId, orderData.service, orderData.game]);

  return (
    <div className="min-h-screen bg-transparent py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للخدمات
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/[0.09] border border-white/[0.15] rounded-xl p-6">
              <h1 className="text-2xl font-bold text-white mb-2">أكمل طلبك</h1>
              <p className="text-zinc-400 text-sm mb-6">
                الدفع آمن ومشفر عبر Moyasar
              </p>

              {/* Security badge */}
              <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/30 mb-6">
                <Shield className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-green-400 text-sm">
                  دفعتك مؤمنة بتشفير SSL 256 بت — مدعومة من Moyasar
                </p>
              </div>

              {/* Moyasar form container */}
              <div ref={formRef} className="mysr-form" />

              {!moyasarReady && (
                <div className="flex items-center justify-center py-12 gap-3">
                  <div className="w-5 h-5 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                  <span className="text-zinc-400">جاري تحميل نموذج الدفع...</span>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/[0.09] border border-white/[0.15] rounded-xl p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-6">ملخص الطلب</h2>

              <div className="flex items-start gap-4 pb-6 border-b border-white/[0.15]">
                <div className="w-16 h-16 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
                  <Gamepad2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{orderData.service}</h3>
                  <p className="text-zinc-400 text-sm">{orderData.game}</p>
                  <p className="text-zinc-500 text-sm">بواسطة {orderData.booster}</p>
                </div>
              </div>

              <div className="py-6 border-b border-white/[0.15] space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">وقت التسليم</span>
                  <span className="text-white">{orderData.deliveryTime}</span>
                </div>
                {orderData.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-zinc-300">{option}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">المجموع الفرعي</span>
                  <span className="text-white">{orderData.price.toFixed(2)} ر.س</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">رسوم الخدمة</span>
                  <span className="text-white">0.00 ر.س</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-3 border-t border-white/[0.15]">
                  <span className="text-white">الإجمالي</span>
                  <span className="text-violet-400">{orderData.price.toFixed(2)} ر.س</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white/[0.07] rounded-lg">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Lock className="w-4 h-4" />
                  <span>دفع آمن مدعوم من Moyasar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
