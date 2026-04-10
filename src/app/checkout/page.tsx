'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, Shield, ArrowRight, Gamepad2, Check, Loader2, CreditCard } from 'lucide-react';
import { API_URL } from '@/lib/config';

interface OrderData {
  id: string;
  price: number;
  service: { title: string; game: string; deliveryTime: string };
  booster: { name: string };
}

const inputClass =
  'w-full px-4 py-3 bg-white/[0.07] border border-white/[0.18] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/25 transition-all';

const labelClass = 'block text-sm font-medium text-zinc-300 mb-1.5';

function formatCardNumber(v: string) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(v: string) {
  const digits = v.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + ' / ' + digits.slice(2);
  return digits;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<OrderData | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) router.replace('/services');
  }, [orderId, router]);

  useEffect(() => {
    if (!orderId) return;
    (async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await fetch(`${API_URL}/orders/${orderId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          if (res.status === 401) { router.replace('/login'); return; }
          throw new Error();
        }
        setOrder(await res.json());
      } catch {
        setOrderError('تعذّر تحميل بيانات الطلب. حاول مرة أخرى.');
      }
    })();
  }, [orderId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setSubmitting(true);
    setPayError(null);

    const rawNumber = cardNumber.replace(/\s/g, '');
    const [mm, yy] = expiry.replace(/\s/g, '').split('/').map(s => s.trim());
    const callbackBase = window.location.origin;

    try {
      const res = await fetch('https://api.moyasar.com/v1/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa((process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY || '') + ':'),
        },
        body: JSON.stringify({
          amount: Math.round(order.price * 100),
          currency: 'SAR',
          description: `${order.service.title} - ${order.service.game}`,
          callback_url: `${callbackBase}/payment/callback?orderId=${orderId}`,
          metadata: { order_id: orderId },
          source: {
            type: 'creditcard',
            name,
            number: rawNumber,
            cvc,
            month: mm,
            year: yy ? '20' + yy : yy,
          },
        }),
      });

      const data = await res.json();

      if (data.source?.transaction_url) {
        // 3DS redirect
        window.location.href = data.source.transaction_url;
        return;
      }

      if (data.status === 'paid' || data.status === 'authorized') {
        router.push(`/payment/callback?orderId=${orderId}&id=${data.id}&status=${data.status}`);
        return;
      }

      const msg = data.source?.message || data.message || data.errors?.join(', ') || 'فشل الدفع، تحقق من بيانات البطاقة';
      setPayError(msg);
    } catch {
      setPayError('حدث خطأ في الاتصال، حاول مرة أخرى');
    } finally {
      setSubmitting(false);
    }
  };

  if (!order && !orderError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    );
  }

  if (orderError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">{orderError}</p>
          <Link href="/services" className="text-violet-400 hover:text-violet-300 underline">العودة للخدمات</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/services" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors">
          <ArrowRight className="w-4 h-4" />
          العودة للخدمات
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/[0.09] border border-white/[0.15] rounded-2xl p-6 sm:p-8">
              <h1 className="text-2xl font-bold text-white mb-1">أكمل طلبك</h1>
              <p className="text-zinc-400 text-sm mb-6">الدفع آمن ومشفر عبر Moyasar</p>

              <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-xl border border-green-500/20 mb-7">
                <Shield className="w-4 h-4 text-green-400 flex-shrink-0" />
                <p className="text-green-400 text-sm">دفعتك مؤمنة بتشفير SSL 256 بت — مدعومة من Moyasar</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className={labelClass}>الاسم على البطاقة</label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="MOHAMMED ALI"
                    className={inputClass + ' text-left'}
                    autoComplete="cc-name"
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label className={labelClass}>رقم البطاقة</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      inputMode="numeric"
                      dir="ltr"
                      value={cardNumber}
                      onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9101 1121"
                      maxLength={19}
                      className={inputClass + ' text-left pl-4 pr-28'}
                      autoComplete="cc-number"
                    />
                    {/* Card network badges */}
                    <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center gap-1 pointer-events-none">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-600 text-white">mada</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-700 text-white">VISA</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-600 text-white">MC</span>
                    </div>
                  </div>
                </div>

                {/* Expiry + CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>تاريخ الانتهاء</label>
                    <input
                      type="text"
                      required
                      inputMode="numeric"
                      dir="ltr"
                      value={expiry}
                      onChange={e => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM / YY"
                      maxLength={7}
                      className={inputClass + ' text-left'}
                      autoComplete="cc-exp"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>رمز الأمان (CVC)</label>
                    <input
                      type="text"
                      required
                      inputMode="numeric"
                      dir="ltr"
                      value={cvc}
                      onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      placeholder="123"
                      maxLength={3}
                      className={inputClass + ' text-left'}
                      autoComplete="cc-csc"
                    />
                  </div>
                </div>

                {payError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-red-400 text-sm">{payError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-lg rounded-xl transition-colors"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      ادفع {order!.price.toFixed(2)} ريال سعودي
                    </>
                  )}
                </button>

                <p className="text-center text-zinc-500 text-xs flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  وضع المدفوعات التجريبي — الرجاء عدم استخدامه في البيئة التشغيلية
                </p>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/[0.09] border border-white/[0.15] rounded-2xl p-6 sticky top-24">
              <h2 className="text-base font-semibold text-white mb-5">ملخص الطلب</h2>

              <div className="flex items-start gap-4 pb-5 border-b border-white/[0.12]">
                <div className="w-14 h-14 rounded-xl bg-violet-600 flex items-center justify-center flex-shrink-0">
                  <Gamepad2 className="w-7 h-7 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-white font-medium truncate">{order!.service.title}</h3>
                  <p className="text-zinc-400 text-sm">{order!.service.game}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">بواسطة {order!.booster.name}</p>
                </div>
              </div>

              <div className="py-4 border-b border-white/[0.12] space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">وقت التسليم</span>
                  <span className="text-white">{order!.service.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-zinc-300">حماية المشتري</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-zinc-300">ضمان استرداد المبلغ</span>
                </div>
              </div>

              <div className="pt-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">المجموع الفرعي</span>
                  <span className="text-white">{order!.price.toFixed(2)} ر.س</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">رسوم الخدمة</span>
                  <span className="text-white">0.00 ر.س</span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-3 border-t border-white/[0.12]">
                  <span className="text-white">الإجمالي</span>
                  <span className="text-violet-400">{order!.price.toFixed(2)} ر.س</span>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs text-zinc-500">
                <Lock className="w-3.5 h-3.5" />
                <span>دفع آمن مدعوم من Moyasar</span>
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
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
