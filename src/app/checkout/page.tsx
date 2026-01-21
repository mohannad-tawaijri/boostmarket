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
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/services" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
              <h1 className="text-2xl font-bold text-white mb-6">Complete Your Order</h1>

              {/* Payment Method Selection */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-white mb-4">Payment Method</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-slate-700 bg-slate-800/30 hover:border-slate-600'
                    }`}
                  >
                    <CreditCard className={`w-6 h-6 mb-2 ${paymentMethod === 'card' ? 'text-indigo-400' : 'text-gray-400'}`} />
                    <p className={`font-medium ${paymentMethod === 'card' ? 'text-white' : 'text-gray-400'}`}>Credit Card</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'paypal'
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-slate-700 bg-slate-800/30 hover:border-slate-600'
                    }`}
                  >
                    <div className={`w-6 h-6 mb-2 font-bold ${paymentMethod === 'paypal' ? 'text-indigo-400' : 'text-gray-400'}`}>PP</div>
                    <p className={`font-medium ${paymentMethod === 'paypal' ? 'text-white' : 'text-gray-400'}`}>PayPal</p>
                  </button>
                </div>
              </div>

              {/* Card Details Form */}
              {paymentMethod === 'card' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">CVC</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                    <Shield className="w-5 h-5 text-green-400" />
                    <p className="text-green-400 text-sm">Your payment is secured with 256-bit SSL encryption</p>
                  </div>

                  <Button type="submit" className="w-full py-4 text-lg" disabled={isProcessing}>
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Lock className="w-5 h-5" />
                        Pay ${orderData.price.toFixed(2)}
                      </span>
                    )}
                  </Button>
                </form>
              )}

              {paymentMethod === 'paypal' && (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-6">You will be redirected to PayPal to complete your payment</p>
                  <Button className="w-full py-4 text-lg">
                    Continue with PayPal
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-6">Order Summary</h2>

              <div className="flex items-start gap-4 pb-6 border-b border-slate-800">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Gamepad2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{orderData.service}</h3>
                  <p className="text-gray-400 text-sm">{orderData.game}</p>
                  <p className="text-gray-500 text-sm">by {orderData.booster}</p>
                </div>
              </div>

              <div className="py-6 border-b border-slate-800 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Delivery Time</span>
                  <span className="text-white">{orderData.deliveryTime}</span>
                </div>
                {orderData.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">{option}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">${orderData.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Service Fee</span>
                  <span className="text-white">$0.00</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-3 border-t border-slate-800">
                  <span className="text-white">Total</span>
                  <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    ${orderData.price.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Lock className="w-4 h-4" />
                  <span>Secure checkout powered by Stripe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
