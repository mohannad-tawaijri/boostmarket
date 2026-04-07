'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { API_URL } from '@/lib/config';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Gamepad2,
  ArrowRight,
  Loader2,
  User,
  Calendar,
  DollarSign,
} from 'lucide-react';

interface Order {
  id: string;
  status: string;
  price: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  requirements?: any;
  service?: { id: string; title: string; game: string };
  buyer?: { id: string; name: string; email?: string; avatar?: string };
  booster?: { id: string; name: string; email?: string; avatar?: string };
  buyerId: string;
  boosterId: string;
}

export default function OrderManagePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setLoading(false);
      setError('سجل دخولك أولاً');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        const err = await res.json().catch(() => ({}));
        setError(err.message || 'ما قدرنا نجيب الطلب');
      }
    } catch (e) {
      console.error(e);
      setError('حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: string) => {
    if (!order) return;
    setUpdating(true);
    const token = localStorage.getItem('authToken');
    try {
      const res = await fetch(`${API_URL}/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await fetchOrder();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.message || 'فشل تحديث الحالة');
      }
    } catch (e) {
      console.error(e);
      alert('فشل تحديث الحالة');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20', label: 'مكتمل' };
      case 'IN_PROGRESS':
        return { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'قيد التنفيذ' };
      case 'PENDING':
        return { icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'قيد الانتظار' };
      case 'CANCELLED':
        return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20', label: 'ملغي' };
      default:
        return { icon: Package, color: 'text-zinc-400', bg: 'bg-gray-500/20', label: status };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-transparent py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/[0.09] border border-white/[0.15] rounded-xl p-12 text-center">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">{error || 'الطلب غير موجود'}</h3>
            <Link href="/dashboard">
              <Button className="mt-4">ارجع للوحة التحكم</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isBooster = user?.id === order.boosterId;
  const isBuyer = user?.id === order.buyerId;
  const statusConfig = getStatusConfig(order.status);
  const counterparty = isBooster ? order.buyer : order.booster;
  const counterpartyLabel = isBooster ? 'العميل' : 'البوستر';

  return (
    <div className="min-h-screen bg-transparent py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard" className="text-violet-400 hover:text-violet-300 text-sm flex items-center gap-1 mb-4">
            <ArrowRight className="w-4 h-4 rotate-180" />
            ارجع للوحة التحكم
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">إدارة الطلب</h1>
          <p className="text-zinc-400 text-sm">رقم الطلب: {order.id}</p>
        </div>

        {/* Status card */}
        <div className="bg-white/[0.09] border border-white/[0.15] rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-violet-600 flex items-center justify-center flex-shrink-0">
                <Gamepad2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">{order.service?.title || 'خدمة'}</h3>
                <p className="text-zinc-400 text-sm">{order.service?.game || ''}</p>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bg}`}>
              <statusConfig.icon className={`w-5 h-5 ${statusConfig.color}`} />
              <span className={`font-medium ${statusConfig.color}`}>{statusConfig.label}</span>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/[0.09] border border-white/[0.15] rounded-xl p-5">
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
              <User className="w-4 h-4" />
              {counterpartyLabel}
            </div>
            <p className="text-white font-medium">{counterparty?.name || '—'}</p>
            {counterparty?.email && (
              <p className="text-zinc-500 text-sm mt-1">{counterparty.email}</p>
            )}
          </div>
          <div className="bg-white/[0.09] border border-white/[0.15] rounded-xl p-5">
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
              <DollarSign className="w-4 h-4" />
              {isBooster ? 'الأرباح' : 'السعر'}
            </div>
            <p className="text-white font-medium">{order.price} ر.س</p>
          </div>
          <div className="bg-white/[0.09] border border-white/[0.15] rounded-xl p-5">
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
              <Calendar className="w-4 h-4" />
              تاريخ الطلب
            </div>
            <p className="text-white font-medium">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          {order.startedAt && (
            <div className="bg-white/[0.09] border border-white/[0.15] rounded-xl p-5">
              <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
                <Clock className="w-4 h-4" />
                بدأ في
              </div>
              <p className="text-white font-medium">{new Date(order.startedAt).toLocaleString()}</p>
            </div>
          )}
          {order.completedAt && (
            <div className="bg-white/[0.09] border border-white/[0.15] rounded-xl p-5">
              <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
                <CheckCircle className="w-4 h-4" />
                اكتمل في
              </div>
              <p className="text-white font-medium">{new Date(order.completedAt).toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* Requirements */}
        {order.requirements && (() => {
          const req: any = order.requirements;
          if (typeof req === 'string') {
            return (
              <div className="bg-white/[0.09] border border-white/[0.15] rounded-xl p-6 mb-6">
                <h3 className="text-white font-semibold mb-3">متطلبات الطلب</h3>
                <p className="text-zinc-300 text-sm whitespace-pre-wrap break-words">{req}</p>
              </div>
            );
          }

          const labels: Record<string, string> = {
            title: 'العنوان',
            description: 'الوصف',
            deliveryTime: 'مدة التسليم',
            offerId: 'رقم العرض',
            customOffer: 'عرض مخصص',
            notes: 'ملاحظات',
            username: 'اسم المستخدم',
            rank: 'الرتبة',
            server: 'السيرفر',
          };

          const renderValue = (key: string, value: any) => {
            if (value === null || value === undefined || value === '') return '—';
            if (typeof value === 'boolean') return value ? 'نعم' : 'لا';
            if (key === 'deliveryTime' && typeof value === 'string') {
              return value.replace('days', 'يوم').replace('hours', 'ساعة');
            }
            if (typeof value === 'object') return JSON.stringify(value);
            return String(value);
          };

          const entries = Object.entries(req).filter(
            ([k, v]) => v !== null && v !== undefined && v !== '' && k !== 'offerId'
          );

          if (entries.length === 0) return null;

          return (
            <div className="bg-white/[0.09] border border-white/[0.15] rounded-xl p-6 mb-6">
              <h3 className="text-white font-semibold mb-4">متطلبات الطلب</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {entries.map(([key, value]) => (
                  <div key={key}>
                    <p className="text-zinc-500 text-xs mb-1">{labels[key] || key}</p>
                    <p className="text-white text-sm break-words">{renderValue(key, value)}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Actions */}
        <div className="bg-white/[0.09] border border-white/[0.15] rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">الإجراءات</h3>
          <div className="flex flex-wrap gap-3">
            {counterparty?.id && order.service?.id && (
              <Link href={`/messages?userId=${counterparty.id}&serviceId=${order.service.id}`}>
                <Button variant="outline" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  مراسلة {counterpartyLabel}
                </Button>
              </Link>
            )}

            {isBooster && order.status === 'PENDING' && (
              <>
                <Button
                  onClick={() => updateStatus('IN_PROGRESS')}
                  disabled={updating}
                  className="gap-2 bg-yellow-500 hover:bg-yellow-600"
                >
                  <Clock className="w-4 h-4" />
                  ابدأ التنفيذ
                </Button>
                <Button
                  onClick={() => updateStatus('CANCELLED')}
                  disabled={updating}
                  variant="outline"
                  className="gap-2 text-red-400 border-red-400/50 hover:bg-red-500/10"
                >
                  <XCircle className="w-4 h-4" />
                  ألغِ الطلب
                </Button>
              </>
            )}

            {isBooster && order.status === 'IN_PROGRESS' && (
              <>
                <Button
                  onClick={() => updateStatus('COMPLETED')}
                  disabled={updating}
                  className="gap-2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  علّم كمكتمل
                </Button>
                <Button
                  onClick={() => updateStatus('CANCELLED')}
                  disabled={updating}
                  variant="outline"
                  className="gap-2 text-red-400 border-red-400/50 hover:bg-red-500/10"
                >
                  <XCircle className="w-4 h-4" />
                  ألغِ الطلب
                </Button>
              </>
            )}

            {updating && <Loader2 className="w-5 h-5 text-violet-400 animate-spin self-center" />}

            {!isBooster && !isBuyer && (
              <p className="text-zinc-400 text-sm">ما عندك صلاحية إدارة هذا الطلب</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
