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

type CardType = 'mada' | 'visa' | 'mastercard' | 'amex' | null;

// Common mada BIN prefixes (6-digit)
const MADA_BINS = [
  '588845','440647','440795','446404','457865','968208','457997','968201',
  '524130','968209','531196','504300','968211','636120','417633','468540',
  '468541','468542','468543','968206','446393','409201','458456','484783',
  '462220','455708','410621','588848','588850','446672','403024','543357',
  '434107','407197','407395','529415','535825','543085','524514','529741',
  '537767','535989','536023','585265','588983','588982','589005','508160',
  '531095','530906','532013','605141','968203','968204','968205','968207',
  '968212','968210','968202','968213','584847',
];

function detectCardType(number: string): CardType {
  const digits = number.replace(/\s/g, '');
  if (digits.length < 2) return null;

  // Check mada first (Saudi debit — specific BIN list)
  const bin6 = digits.slice(0, 6);
  if (MADA_BINS.includes(bin6)) return 'mada';

  // AMEX: starts with 34 or 37
  if (/^3[47]/.test(digits)) return 'amex';

  // Visa: starts with 4
  if (/^4/.test(digits)) return 'visa';

  // Mastercard: 51-55 or 2221-2720
  const two = parseInt(digits.slice(0, 2));
  const four = parseInt(digits.slice(0, 4));
  if ((two >= 51 && two <= 55) || (four >= 2221 && four <= 2720)) return 'mastercard';

  return null;
}

const CARD_LABELS: Record<string, { label: string; bg: string }> = {
  mada: { label: 'mada', bg: 'bg-green-600' },
  visa: { label: 'VISA', bg: 'bg-blue-700' },
  mastercard: { label: 'Mastercard', bg: 'bg-red-600' },
  amex: { label: 'AMEX', bg: 'bg-sky-600' },
};

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const rawDigits = cardNumber.replace(/\s/g, '');
  const detectedCard = detectCardType(rawDigits);

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

  const validateFields = (): boolean => {
    const errors: Record<string, string> = {};
    const trimmedName = name.trim();

    if (!trimmedName) {
      errors.name = 'أدخل الاسم على البطاقة';
    } else if (trimmedName.length < 3) {
      errors.name = 'الاسم قصير جداً';
    } else if (trimmedName.length > 50) {
      errors.name = 'الاسم طويل جداً (50 حرف كحد أقصى)';
    }

    if (rawDigits.length < 15) {
      errors.card = 'رقم البطاقة غير مكتمل';
    } else if (rawDigits.length > 16) {
      errors.card = 'رقم البطاقة طويل جداً';
    }

    const expiryParts = expiry.replace(/\s/g, '').split('/');
    const mm = parseInt(expiryParts[0]);
    const yy = parseInt(expiryParts[1]);
    if (!mm || !yy || isNaN(mm) || isNaN(yy)) {
      errors.expiry = 'أدخل تاريخ الانتهاء';
    } else if (mm < 1 || mm > 12) {
      errors.expiry = 'الشهر يجب أن يكون بين 01 و 12';
    } else {
      const now = new Date();
      const expDate = new Date(2000 + yy, mm);
      if (expDate <= now) {
        errors.expiry = 'البطاقة منتهية الصلاحية';
      }
    }

    if (cvc.length < 3) {
      errors.cvc = 'رمز الأمان يجب أن يكون 3 أرقام';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    if (!validateFields()) return;

    setSubmitting(true);
    setPayError(null);
    setFieldErrors({});

    const rawNumber = rawDigits;
    const [mm, yy] = expiry.replace(/\s/g, '').split('/').map(s => s.trim());
    // Moyasar requires a callback_url on the token (used for the 3-D Secure
    // redirect). It must point back to our payment callback page.
    const callbackUrl = `${window.location.origin}/payment/callback?orderId=${orderId}`;

    try {
      // 1) Tokenize the card with Moyasar using the *publishable* key. The PAN/CVC
      //    go straight to Moyasar and never touch our backend.
      const tokenRes = await fetch('https://api.moyasar.com/v1/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa((process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY || '') + ':'),
        },
        body: JSON.stringify({
          name,
          number: rawNumber,
          cvc,
          month: mm,
          year: yy ? '20' + yy : yy,
          callback_url: callbackUrl,
        }),
      });
      const tokenData = await tokenRes.json();
      if (!tokenRes.ok || !tokenData?.id) {
        const errs = tokenData?.errors && typeof tokenData.errors === 'object' && !Array.isArray(tokenData.errors)
          ? Object.entries(tokenData.errors).map(([f, m]) => `${f}: ${Array.isArray(m) ? m.join(', ') : m}`).join(' — ')
          : null;
        const tMsg = errs || tokenData?.message || 'فشل التحقق من البطاقة، تحقق من البيانات';
        setPayError(typeof tMsg === 'string' ? tMsg : 'فشل التحقق من البطاقة');
        return;
      }

      // 2) Create the charge on our backend. The amount is fixed from the order
      //    on the server, so it can't be tampered with from the client.
      const authToken = localStorage.getItem('authToken');
      const res = await fetch(`${API_URL}/payment/create-charge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ orderId, token: tokenData.id }),
      });
      const data = await res.json();

      if (!res.ok) {
        setPayError(data?.message || data?.error || 'فشل الدفع، حاول مرة أخرى');
        return;
      }

      if (data.source?.transaction_url) {
        // 3DS redirect
        window.location.href = data.source.transaction_url;
        return;
      }

      if (data.status === 'paid' || data.status === 'authorized') {
        router.push(`/payment/callback?orderId=${orderId}&id=${data.id}&status=${data.status}`);
        return;
      }

      setPayError('تعذّر إتمام الدفع. حاول مرة أخرى');
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
                <p className="text-green-400 text-sm">دفعتك آمنة ومشفرة بالكامل</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className={labelClass}>الاسم على البطاقة</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={name}
                    onChange={e => setName(e.target.value.slice(0, 50))}
                    placeholder="MOHAMMED ALI"
                    className={inputClass + ' text-left' + (fieldErrors.name ? ' border-red-500/60' : '')}
                    autoComplete="cc-name"
                  />
                  {fieldErrors.name && <p className="text-red-400 text-xs mt-1">{fieldErrors.name}</p>}
                </div>

                {/* Card Number */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-zinc-300">رقم البطاقة</label>
                    {detectedCard && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${CARD_LABELS[detectedCard].bg} text-white animate-in fade-in`}>
                        {CARD_LABELS[detectedCard].label}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      dir="ltr"
                      value={cardNumber}
                      onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9101 1121"
                      maxLength={19}
                      className={inputClass + ' text-left pl-4 pr-28' + (fieldErrors.card ? ' border-red-500/60' : '')}
                      autoComplete="cc-number"
                    />
                    {/* Dim badges for undetected, highlight only the detected one */}
                    <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center gap-1 pointer-events-none">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white transition-opacity ${detectedCard === 'mada' ? 'bg-green-600' : detectedCard ? 'bg-zinc-700 opacity-40' : 'bg-green-600/70'}`}>mada</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white transition-opacity ${detectedCard === 'visa' ? 'bg-blue-700' : detectedCard ? 'bg-zinc-700 opacity-40' : 'bg-blue-700/70'}`}>VISA</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white transition-opacity ${detectedCard === 'mastercard' ? 'bg-red-600' : detectedCard ? 'bg-zinc-700 opacity-40' : 'bg-red-600/70'}`}>MC</span>
                    </div>
                  </div>
                  {fieldErrors.card && <p className="text-red-400 text-xs mt-1">{fieldErrors.card}</p>}
                </div>

                {/* Expiry + CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>تاريخ الانتهاء</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      dir="ltr"
                      value={expiry}
                      onChange={e => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM / YY"
                      maxLength={7}
                      className={inputClass + ' text-left' + (fieldErrors.expiry ? ' border-red-500/60' : '')}
                      autoComplete="cc-exp"
                    />
                    {fieldErrors.expiry && <p className="text-red-400 text-xs mt-1">{fieldErrors.expiry}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>رمز الأمان (CVC)</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      dir="ltr"
                      value={cvc}
                      onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      placeholder="123"
                      maxLength={3}
                      className={inputClass + ' text-left' + (fieldErrors.cvc ? ' border-red-500/60' : '')}
                      autoComplete="cc-csc"
                    />
                    {fieldErrors.cvc && <p className="text-red-400 text-xs mt-1">{fieldErrors.cvc}</p>}
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
