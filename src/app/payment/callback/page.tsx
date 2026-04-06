'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { API_URL } from '@/lib/config';

type PaymentStatus = 'paid' | 'failed' | 'authorized' | 'initiated' | 'loading';

interface PaymentInfo {
  id: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  description: string;
  message?: string;
}

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [status, setStatus] = useState<PaymentStatus>('loading');

  useEffect(() => {
    const paymentId = searchParams.get('id');
    const paymentStatus = searchParams.get('status') as PaymentStatus | null;
    const message = searchParams.get('message') || undefined;
    const orderId = searchParams.get('orderId');

    if (!paymentId || !paymentStatus) {
      setStatus('failed');
      return;
    }

    // Notify our backend to verify and update payment status
    const verifyPayment = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_URL}/payment/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ paymentId, orderId, status: paymentStatus }),
        });

        if (res.ok) {
          const data = await res.json();
          setPaymentInfo({
            id: paymentId,
            status: data.status || paymentStatus,
            amount: data.amount || 0,
            currency: data.currency || 'SAR',
            description: data.description || '',
            message,
          });
          setStatus(data.status || paymentStatus);
        } else {
          // Even if backend fails, show the status from Moyasar redirect
          setStatus(paymentStatus);
          setPaymentInfo({ id: paymentId, status: paymentStatus, amount: 0, currency: 'SAR', description: '', message });
        }
      } catch {
        setStatus(paymentStatus);
        setPaymentInfo({ id: paymentId, status: paymentStatus, amount: 0, currency: 'SAR', description: '', message });
      }
    };

    verifyPayment();
  }, [searchParams]);

  const isPaid = status === 'paid' || status === 'authorized';
  const isFailed = status === 'failed';
  const isLoading = status === 'loading';

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white/[0.09] border border-white/[0.15] rounded-2xl p-8 text-center">
          {isLoading && (
            <>
              <Loader2 className="w-16 h-16 text-violet-400 mx-auto mb-6 animate-spin" />
              <h1 className="text-2xl font-bold text-white mb-2">جاري التحقق من الدفع...</h1>
              <p className="text-zinc-400">يرجى الانتظار</p>
            </>
          )}

          {!isLoading && isPaid && (
            <>
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">تم الدفع بنجاح! 🎉</h1>
              <p className="text-zinc-400 mb-2">
                شكراً لك، تمت معالجة دفعتك بنجاح.
              </p>
              {paymentInfo?.id && (
                <p className="text-zinc-500 text-sm mb-6">
                  رقم المعاملة: <span className="font-mono text-zinc-300">{paymentInfo.id}</span>
                </p>
              )}
              <div className="space-y-3">
                <Button
                  className="w-full"
                  onClick={() => router.push('/orders')}
                >
                  عرض طلباتي
                </Button>
                <Link href="/" className="block text-zinc-400 hover:text-white text-sm transition-colors">
                  العودة للرئيسية
                </Link>
              </div>
            </>
          )}

          {!isLoading && isFailed && (
            <>
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-12 h-12 text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">فشل الدفع</h1>
              <p className="text-zinc-400 mb-2">
                {paymentInfo?.message || 'حدث خطأ أثناء معالجة دفعتك. يرجى المحاولة مرة أخرى.'}
              </p>
              <div className="space-y-3 mt-6">
                <Button
                  className="w-full"
                  onClick={() => router.back()}
                >
                  المحاولة مرة أخرى
                </Button>
                <Link href="/services" className="block text-zinc-400 hover:text-white text-sm transition-colors">
                  العودة للخدمات
                </Link>
              </div>
            </>
          )}

          {!isLoading && !isPaid && !isFailed && (
            <>
              <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-12 h-12 text-yellow-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">الدفع قيد المعالجة</h1>
              <p className="text-zinc-400 mb-6">
                دفعتك قيد المراجعة. سنخطرك عند التأكيد.
              </p>
              <Link href="/orders">
                <Button className="w-full">عرض طلباتي</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
