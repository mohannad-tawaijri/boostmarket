'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { API_URL } from '@/lib/config';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Gamepad2,
  ArrowRight,
  Loader2,
  Star,
  X
} from 'lucide-react';

interface Order {
  id: string;
  service: { id: string; title: string; game: string };
  booster: { id: string; name: string };
  status: string;
  totalPrice: number;
  createdAt: string;
  requirements?: any;
  review?: { id: string; rating: number; comment?: string };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'IN_PROGRESS' | 'COMPLETED' | 'PENDING' | 'CANCELLED'>('all');
  
  // Review modal state
  const [reviewModalOrder, setReviewModalOrder] = useState<Order | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/orders?role=buyer`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!reviewModalOrder) return;
    
    setSubmittingReview(true);
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: reviewModalOrder.id,
          serviceId: reviewModalOrder.service.id,
          boosterId: reviewModalOrder.booster.id,
          rating: reviewRating,
          comment: reviewComment || undefined,
        }),
      });

      if (response.ok) {
        // Close modal and refresh orders
        setReviewModalOrder(null);
        setReviewRating(5);
        setReviewComment('');
        fetchOrders();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20', label: 'Completed' };
      case 'IN_PROGRESS':
        return { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'In Progress' };
      case 'PENDING':
        return { icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Pending' };
      case 'CANCELLED':
        return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Cancelled' };
      default:
        return { icon: Package, color: 'text-zinc-400', bg: 'bg-gray-500/20', label: status };
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0c0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0f] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Orders</h1>
            <p className="text-zinc-400">Orders you've placed for boosting services</p>
          </div>
          <Link href="/services">
            <Button className="mt-4 md:mt-0">
              Browse Services
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'IN_PROGRESS', label: 'In Progress' },
            { id: 'COMPLETED', label: 'Completed' },
            { id: 'PENDING', label: 'Pending' },
            { id: 'CANCELLED', label: 'Cancelled' },
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id as typeof filter)}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === filterOption.id
                  ? 'bg-violet-600 text-white'
                  : 'bg-zinc-800/40 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-12 text-center">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No orders found</h3>
              <p className="text-zinc-400 mb-6">
                {filter === 'all' 
                  ? "You haven't placed any orders yet" 
                  : "No orders matching this filter"}
              </p>
              <Link href="/services">
                <Button>Browse Services</Button>
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const isExpanded = expandedOrder === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl overflow-hidden hover:border-zinc-700 transition-all"
                >
                  {/* Order Header */}
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-violet-600 flex items-center justify-center flex-shrink-0">
                          <Gamepad2 className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{order.service?.title || 'Service'}</h3>
                          <p className="text-zinc-400 text-sm">{order.service?.game || 'Game'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.bg}`}>
                          <statusConfig.icon className={`w-4 h-4 ${statusConfig.color}`} />
                          <span className={`text-sm font-medium ${statusConfig.color}`}>{statusConfig.label}</span>
                        </div>
                        {order.status === 'COMPLETED' && !order.review && (
                          <div className="hidden sm:flex items-center gap-1 text-yellow-400">
                            <Star className="w-4 h-4" />
                            <span className="text-xs">Needs review</span>
                          </div>
                        )}
                        <div className="text-right hidden sm:block">
                          <p className="text-white font-semibold">${order.totalPrice}</p>
                          <p className="text-zinc-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-zinc-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-zinc-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-zinc-800/60 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <p className="text-zinc-500 text-sm mb-1">Booster</p>
                          <p className="text-white font-medium">{order.booster?.name || 'Booster'}</p>
                        </div>
                        <div>
                          <p className="text-zinc-500 text-sm mb-1">Order ID</p>
                          <p className="text-white font-medium text-sm">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-zinc-500 text-sm mb-1">Status</p>
                          <p className={`font-medium ${statusConfig.color}`}>{statusConfig.label}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-6">
                        <Link href={`/messages?userId=${order.booster?.id}&serviceId=${order.service?.id}`}>
                          <Button variant="outline" className="gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Message Booster
                          </Button>
                        </Link>
                        {order.status === 'COMPLETED' && !order.review && (
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setReviewModalOrder(order);
                            }}
                            className="gap-2 bg-amber-500 hover:from-yellow-400 hover:to-orange-400"
                          >
                            <Star className="w-4 h-4" />
                            Leave Review
                          </Button>
                        )}
                        {order.review && (
                          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 text-sm font-medium">
                              Reviewed ({order.review.rating}/5)
                            </span>
                          </div>
                        )}
                        <Link href={`/services/${order.service?.id}`}>
                          <Button variant="ghost" className="gap-2">
                            View Service
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Review Modal */}
      {reviewModalOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Leave a Review</h2>
              <button
                onClick={() => {
                  setReviewModalOrder(null);
                  setReviewRating(5);
                  setReviewComment('');
                }}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-zinc-400 text-sm mb-1">Service</p>
              <p className="text-white font-medium">{reviewModalOrder.service.title}</p>
            </div>

            <div className="mb-4">
              <p className="text-zinc-400 text-sm mb-1">Booster</p>
              <p className="text-white font-medium">{reviewModalOrder.booster.name}</p>
            </div>

            {/* Star Rating */}
            <div className="mb-6">
              <p className="text-zinc-400 text-sm mb-3">Your Rating</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= reviewRating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-zinc-500 mt-2">
                {reviewRating === 1 && 'Poor'}
                {reviewRating === 2 && 'Fair'}
                {reviewRating === 3 && 'Good'}
                {reviewRating === 4 && 'Very Good'}
                {reviewRating === 5 && 'Excellent'}
              </p>
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="text-zinc-400 text-sm mb-2 block">Comment (optional)</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience with this booster..."
                rows={4}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setReviewModalOrder(null);
                  setReviewRating(5);
                  setReviewComment('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={submitReview}
                disabled={submittingReview}
                className="flex-1 bg-violet-600"
              >
                {submittingReview ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Submit Review'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
