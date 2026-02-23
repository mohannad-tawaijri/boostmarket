'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  Lock, 
  Shield, 
  Check, 
  ArrowLeft,
  Gamepad2
} from 'lucide-react';

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock order data - in real app this would come from cart/context
  const orderData = {
    service: 'Diamond Rank Boost',
    game: 'League of Legends',
    booster: 'ProBooster123',
    price: 89.99,
    deliveryTime: '2-3 days',
    options: ['VPN Protection', 'Offline Mode'],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Redirect to success page
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-transparent py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/services" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          العودة للخدمات
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
              <h1 className="text-2xl font-bold text-white mb-6">أكمل طلبك</h1>

              {/* Payment Method Selection */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-white mb-4">طريقة الدفع</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-white/[0.08] bg-white/[0.02] hover:border-zinc-700'
                    }`}
                  >
                    <CreditCard className={`w-6 h-6 mb-2 ${paymentMethod === 'card' ? 'text-violet-400' : 'text-zinc-400'}`} />
                    <p className={`font-medium ${paymentMethod === 'card' ? 'text-white' : 'text-zinc-400'}`}>بطاقة ائتمان</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'paypal'
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-white/[0.08] bg-white/[0.02] hover:border-zinc-700'
                    }`}
                  >
                    <div className={`w-6 h-6 mb-2 font-bold ${paymentMethod === 'paypal' ? 'text-violet-400' : 'text-zinc-400'}`}>PP</div>
                    <p className={`font-medium ${paymentMethod === 'paypal' ? 'text-white' : 'text-zinc-400'}`}>باي بال</p>
                  </button>
                </div>
              </div>

              {/* Card Details Form */}
              {paymentMethod === 'card' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">رقم البطاقة</label>
                    <div className="relative">
                      <CreditCard className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg ps-10 pe-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">تاريخ الانتهاء</label>
                      <input
                        type="text"
                        placeholder="شهر/سنة"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">رمز الأمان</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">الاسم على البطاقة</label>
                    <input
                      type="text"
                      placeholder="محمد أحمد"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                    <Shield className="w-5 h-5 text-green-400" />
                    <p className="text-green-400 text-sm">دفعتك مؤمنة بتشفير SSL 256 بت</p>
                  </div>

                  <Button type="submit" className="w-full py-4 text-lg" disabled={isProcessing}>
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        جاري المعالجة...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Lock className="w-5 h-5" />
                        ادفع ${orderData.price.toFixed(2)}
                      </span>
                    )}
                  </Button>
                </form>
              )}

              {paymentMethod === 'paypal' && (
                <div className="text-center py-8">
                  <p className="text-zinc-400 mb-6">سيتم تحويلك إلى باي بال لإتمام الدفع</p>
                  <Button className="w-full py-4 text-lg">
                    المتابعة مع باي بال
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-6">ملخص الطلب</h2>

              <div className="flex items-start gap-4 pb-6 border-b border-white/[0.06]">
                <div className="w-16 h-16 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
                  <Gamepad2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{orderData.service}</h3>
                  <p className="text-zinc-400 text-sm">{orderData.game}</p>
                  <p className="text-zinc-500 text-sm">بواسطة {orderData.booster}</p>
                </div>
              </div>

              <div className="py-6 border-b border-white/[0.06] space-y-3">
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
                  <span className="text-white">${orderData.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">رسوم الخدمة</span>
                  <span className="text-white">$0.00</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-3 border-t border-white/[0.06]">
                  <span className="text-white">الإجمالي</span>
                  <span className="text-violet-400">
                    ${orderData.price.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white/[0.02] rounded-lg">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Lock className="w-4 h-4" />
                  <span>دفع آمن مدعوم من Stripe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
