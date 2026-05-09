'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { API_URL } from '@/lib/config';
import { GAME_IMAGES, GameCategory } from '@/types';
import {
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle,
  Plus,
  ArrowRight,
  Gamepad2,
  TrendingUp,
  MessageSquare,
  Loader2,
  Edit3,
  Package,
  ShoppingCart,
  Eye,
  EyeOff,
} from 'lucide-react';

interface Order {
  id: string;
  service: { title: string };
  status: string;
  price: number;
  createdAt: string;
  buyerId: string;
  boosterId: string;
  buyer?: { id: string; name: string };
  booster?: { id: string; name: string };
}

interface Offer {
  id: string;
  title: string;
  game: string;
  category: string;
  price: number;
  active: boolean;
  allowDirectPurchase: boolean;
  stock?: number | null;
  orders?: Order[];
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const validTabs = ['overview', 'orders', 'customer-orders', 'offers'] as const;
  type Tab = typeof validTabs[number];
  const initialTab = validTabs.includes(tabParam as Tab) ? (tabParam as Tab) : 'overview';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) { setLoading(false); return; }
      try {
        const [servicesRes, myOrdersRes, customerOrdersRes] = await Promise.all([
          fetch(`${API_URL}/services/my`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/orders?role=buyer`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/orders?role=booster`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (servicesRes.ok) setOffers(await servicesRes.json());
        if (myOrdersRes.ok) setMyOrders(await myOrdersRes.json());
        if (customerOrdersRes.ok) setCustomerOrders(await customerOrdersRes.json());
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalEarnings = customerOrders
    .filter(o => o.status === 'COMPLETED')
    .reduce((sum, o) => sum + o.price, 0);
  const completedOrders = [...myOrders, ...customerOrders].filter(o => o.status === 'COMPLETED').length;
  const inProgressOrders = [...myOrders, ...customerOrders].filter(o => o.status === 'IN_PROGRESS').length;

  const stats = [
    { label: 'طلباتي', value: myOrders.length, icon: ShoppingBag, iconBg: 'bg-blue-500/15', iconColor: 'text-blue-400', border: 'border-blue-500/20' },
    { label: 'إجمالي الأرباح', value: `${totalEarnings.toLocaleString('ar-SA')} ر.س`, icon: DollarSign, iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400', border: 'border-emerald-500/20' },
    { label: 'عروضي', value: offers.length, icon: Gamepad2, iconBg: 'bg-amber-500/15', iconColor: 'text-amber-400', border: 'border-amber-500/20' },
    { label: 'مكتمل', value: completedOrders, icon: CheckCircle, iconBg: 'bg-violet-500/15', iconColor: 'text-violet-400', border: 'border-violet-500/20' },
  ];

  const tabs = [
    { id: 'overview' as Tab, label: 'الرئيسية', icon: TrendingUp },
    { id: 'orders' as Tab, label: 'طلباتي', icon: ShoppingBag, count: myOrders.length },
    { id: 'customer-orders' as Tab, label: 'طلبات العملاء', icon: DollarSign, count: customerOrders.length },
    { id: 'offers' as Tab, label: 'عروضي', icon: Gamepad2, count: offers.length },
  ];

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
      COMPLETED:   { label: 'مكتمل',       className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
      IN_PROGRESS: { label: 'قيد التنفيذ', className: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25' },
      PENDING:     { label: 'قيد الانتظار', className: 'bg-blue-500/15 text-blue-400 border-blue-500/25' },
      CANCELLED:   { label: 'ملغي',         className: 'bg-red-500/15 text-red-400 border-red-500/25' },
    };
    const s = map[status?.toUpperCase()];
    if (!s) return <span className="px-2.5 py-1 text-xs rounded-full border bg-zinc-500/15 text-zinc-400 border-zinc-500/25">{status}</span>;
    return <span className={`px-2.5 py-1 text-xs rounded-full border ${s.className}`}>{s.label}</span>;
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center py-12">
      <Loader2 className="w-7 h-7 text-violet-400 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              مرحباً، <span className="text-violet-400">{user?.name || 'لاعب'}</span>
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              {inProgressOrders > 0
                ? `لديك ${inProgressOrders} طلب قيد التنفيذ`
                : 'لا يوجد طلبات نشطة الآن'}
            </p>
          </div>
          <Link href="/create-offer">
            <Button className="gap-2 bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/30">
              <Plus className="w-4 h-4" />
              أضف خدمة
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white/[0.06] border border-white/[0.1] rounded-xl p-5 hover:bg-white/[0.09] hover:border-white/[0.15] transition-all duration-200">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-zinc-500 text-xs mb-2">{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-bold text-white truncate">{stat.value}</p>
                </div>
                <div className={`p-2.5 rounded-lg ${stat.iconBg} border ${stat.border} flex-shrink-0`}>
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-900/40'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.07]'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {'count' in tab && tab.count! > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-white/[0.08] text-zinc-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-4">

              {/* My Orders */}
              <div className="bg-white/[0.06] border border-white/[0.1] rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
                  <h2 className="text-sm font-semibold text-white">طلباتي الأخيرة</h2>
                  {myOrders.length > 0 && (
                    <button onClick={() => setActiveTab('orders')} className="text-violet-400 hover:text-violet-300 text-xs flex items-center gap-1 transition-colors">
                      عرض الكل <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
                {loading ? <LoadingSpinner /> : myOrders.length === 0 ? (
                  <div className="flex items-center gap-2 px-5 py-5 text-zinc-500 text-sm">
                    <ShoppingBag className="w-4 h-4 flex-shrink-0" />
                    <span>لا يوجد طلبات —</span>
                    <Link href="/services" className="text-violet-400 hover:text-violet-300 transition-colors">استعرض الخدمات</Link>
                  </div>
                ) : (
                  <div>
                    {myOrders.slice(0, 4).map((order) => (
                      <Link key={order.id} href={`/orders/${order.id}`} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.04] transition-colors border-b border-white/[0.05] last:border-0 group">
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium truncate group-hover:text-violet-300 transition-colors">{order.service?.title || 'خدمة'}</p>
                          <p className="text-zinc-600 text-xs mt-0.5">{new Date(order.createdAt).toLocaleDateString('ar-SA')}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0 ms-3">
                          {getStatusBadge(order.status)}
                          <span className="text-zinc-400 text-sm tabular-nums">{order.price} ر.س</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Customer Orders */}
              <div className="bg-white/[0.06] border border-white/[0.1] rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
                  <h2 className="text-sm font-semibold text-white">طلبات العملاء</h2>
                  {customerOrders.length > 0 && (
                    <button onClick={() => setActiveTab('customer-orders')} className="text-violet-400 hover:text-violet-300 text-xs flex items-center gap-1 transition-colors">
                      عرض الكل <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
                {loading ? <LoadingSpinner /> : customerOrders.length === 0 ? (
                  <div className="flex items-center gap-2 px-5 py-5 text-zinc-500 text-sm">
                    <DollarSign className="w-4 h-4 flex-shrink-0" />
                    <span>لا يوجد طلبات —</span>
                    <Link href="/create-offer" className="text-violet-400 hover:text-violet-300 transition-colors">أضف خدمة</Link>
                  </div>
                ) : (
                  <div>
                    {customerOrders.slice(0, 4).map((order) => (
                      <Link key={order.id} href={`/orders/${order.id}`} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.04] transition-colors border-b border-white/[0.05] last:border-0 group">
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium truncate group-hover:text-violet-300 transition-colors">{order.service?.title || 'خدمة'}</p>
                          <p className="text-zinc-600 text-xs mt-0.5">{order.buyer?.name || ''} · {new Date(order.createdAt).toLocaleDateString('ar-SA')}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0 ms-3">
                          {getStatusBadge(order.status)}
                          <span className="text-emerald-400 text-sm tabular-nums">{order.price} ر.س</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Earnings Card */}
              <div className="bg-gradient-to-br from-violet-600/20 to-purple-900/10 border border-violet-500/20 rounded-xl p-5">
                <p className="text-zinc-400 text-xs mb-1">إجمالي الأرباح</p>
                <p className="text-3xl font-bold text-white tabular-nums">
                  {totalEarnings.toLocaleString('ar-SA')}
                  <span className="text-base text-zinc-400 font-normal"> ر.س</span>
                </p>
                <p className="text-zinc-500 text-xs mt-2">
                  من {customerOrders.filter(o => o.status === 'COMPLETED').length} طلبات مكتملة
                </p>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/[0.06] border border-white/[0.1] rounded-xl p-5">
                <h2 className="text-sm font-semibold text-white mb-3">اختصارات</h2>
                <div className="space-y-1">
                  {[
                    { href: '/services',      icon: ShoppingBag,   iconColor: 'text-violet-400', label: 'استعرض الخدمات', sub: 'اطلب من البوسترز' },
                    { href: '/create-offer',  icon: Plus,          iconColor: 'text-purple-400', label: 'أضف خدمة',        sub: 'ابدأ تبيع' },
                    { href: '/orders',        icon: Clock,         iconColor: 'text-yellow-400', label: 'طلباتي',          sub: 'تابع طلباتك' },
                    { href: '/messages',      icon: MessageSquare, iconColor: 'text-green-400',  label: 'الرسائل',         sub: 'ردّ على رسائلك' },
                  ].map(({ href, icon: Icon, iconColor, label, sub }) => (
                    <Link key={href} href={href} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.07] transition-all group">
                      <Icon className={`w-4 h-4 ${iconColor} flex-shrink-0`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm">{label}</p>
                        <p className="text-zinc-600 text-xs">{sub}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-400 transition-colors flex-shrink-0 rotate-180" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white/[0.06] border border-white/[0.1] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.1] flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">طلباتي</h2>
                <p className="text-zinc-500 text-sm">خدمات طلبتها من بوسترز</p>
              </div>
              <Link href="/orders">
                <Button variant="outline" size="sm" className="border-white/[0.15] text-zinc-300 hover:text-white hover:border-white/[0.25] text-xs">
                  جميع الطلبات
                </Button>
              </Link>
            </div>
            {loading ? <LoadingSpinner /> : myOrders.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-400 mb-1 font-medium">لا يوجد طلبات</p>
                <p className="text-zinc-600 text-sm mb-5">ابدأ بطلب خدمة من أحد البوسترز</p>
                <Link href="/services"><Button>استعرض الخدمات</Button></Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/[0.04] text-zinc-500 text-xs">
                      <th className="text-right font-medium px-6 py-3">الخدمة</th>
                      <th className="text-right font-medium px-6 py-3">البوستر</th>
                      <th className="text-right font-medium px-6 py-3">الحالة</th>
                      <th className="text-right font-medium px-6 py-3">السعر</th>
                      <th className="text-right font-medium px-6 py-3">التاريخ</th>
                      <th className="px-6 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {myOrders.map((order) => (
                      <tr
                        key={order.id}
                        onClick={() => window.location.href = `/orders/${order.id}`}
                        className="border-t border-white/[0.05] hover:bg-white/[0.04] transition-colors cursor-pointer group"
                      >
                        <td className="px-6 py-4 text-white font-medium">{order.service?.title || 'خدمة'}</td>
                        <td className="px-6 py-4 text-zinc-400">{order.booster?.name || '—'}</td>
                        <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                        <td className="px-6 py-4 text-zinc-300 tabular-nums">{order.price} ر.س</td>
                        <td className="px-6 py-4 text-zinc-500">{new Date(order.createdAt).toLocaleDateString('ar-SA')}</td>
                        <td className="px-6 py-4 text-violet-400 text-xs group-hover:text-violet-300 transition-colors">تفاصيل</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Customer Orders Tab */}
        {activeTab === 'customer-orders' && (
          <div className="bg-white/[0.06] border border-white/[0.1] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.1]">
              <h2 className="text-base font-semibold text-white">طلبات العملاء</h2>
              <p className="text-zinc-500 text-sm">الطلبات الواردة على خدماتك</p>
            </div>
            {loading ? <LoadingSpinner /> : customerOrders.length === 0 ? (
              <div className="text-center py-16">
                <DollarSign className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-400 mb-1 font-medium">لا يوجد طلبات بعد</p>
                <p className="text-zinc-600 text-sm mb-5">أضف خدمتك وابدأ تستقبل طلبات</p>
                <Link href="/create-offer"><Button>أضف خدمة</Button></Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/[0.04] text-zinc-500 text-xs">
                      <th className="text-right font-medium px-6 py-3">الخدمة</th>
                      <th className="text-right font-medium px-6 py-3">العميل</th>
                      <th className="text-right font-medium px-6 py-3">الحالة</th>
                      <th className="text-right font-medium px-6 py-3">الأرباح</th>
                      <th className="text-right font-medium px-6 py-3">التاريخ</th>
                      <th className="text-right font-medium px-6 py-3">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerOrders.map((order) => (
                      <tr key={order.id} className="border-t border-white/[0.05] hover:bg-white/[0.04] transition-colors">
                        <td className="px-6 py-4 text-white font-medium">{order.service?.title || 'خدمة'}</td>
                        <td className="px-6 py-4 text-zinc-400">{order.buyer?.name || '—'}</td>
                        <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                        <td className="px-6 py-4 text-emerald-400 tabular-nums font-medium">{order.price} ر.س</td>
                        <td className="px-6 py-4 text-zinc-500">{new Date(order.createdAt).toLocaleDateString('ar-SA')}</td>
                        <td className="px-6 py-4">
                          <Link href={`/orders/${order.id}`}>
                            <Button variant="outline" size="sm" className="border-white/[0.15] text-zinc-300 hover:text-white text-xs h-7 px-3">إدارة</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Offers Tab */}
        {activeTab === 'offers' && (
          <div className="space-y-3">
            {loading ? (
              <LoadingSpinner />
            ) : offers.length === 0 ? (
              <div className="bg-white/[0.06] border border-white/[0.1] rounded-xl p-14 text-center">
                <Gamepad2 className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-1">لا يوجد خدمات</h3>
                <p className="text-zinc-500 text-sm mb-6">ابدأ ببيع خدماتك اليوم</p>
                <Link href="/create-offer">
                  <Button className="gap-2"><Plus className="w-4 h-4" />أضف أول خدمة</Button>
                </Link>
              </div>
            ) : (
              <>
                {offers.map((offer) => (
                  <div key={offer.id} className="bg-white/[0.06] border border-white/[0.1] rounded-xl p-5 hover:bg-white/[0.08] hover:border-white/[0.17] transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <h3 className="text-white font-semibold truncate">{offer.title}</h3>
                          {offer.active ? (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 flex-shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              نشط
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/15 text-red-400 border border-red-500/20 flex items-center gap-1 flex-shrink-0">
                              <EyeOff className="w-3 h-3" />
                              متوقف
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-zinc-500 flex-wrap">
                          <span className="flex items-center gap-1.5">
                            {GAME_IMAGES[offer.game as GameCategory] && (
                              <Image
                                src={GAME_IMAGES[offer.game as GameCategory]}
                                alt={offer.game}
                                width={14}
                                height={14}
                                className="object-contain opacity-80"
                              />
                            )}
                            {offer.game}
                          </span>
                          {offer.category === 'ITEMS' && offer.stock != null && (
                            <span className="flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              {offer.stock > 0
                                ? <span className="text-amber-400">{offer.stock} متبقي</span>
                                : <span className="text-red-400">نفذت الكمية</span>}
                            </span>
                          )}
                          {offer.allowDirectPurchase && (
                            <span className="flex items-center gap-1 text-green-400">
                              <ShoppingCart className="w-3 h-3" />
                              شراء مباشر
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div>
                          <p className="text-xl font-bold text-white tabular-nums">
                            {offer.price} <span className="text-sm font-normal text-zinc-500">ر.س</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/create-offer/${offer.id}`}>
                            <Button variant="outline" size="sm" className="gap-1.5 border-white/[0.15] text-zinc-300 hover:text-white h-8 text-xs">
                              <Edit3 className="w-3.5 h-3.5" />
                              تعديل
                            </Button>
                          </Link>
                          <Link href={`/services/${offer.id}`}>
                            <Button variant="outline" size="sm" className="border-white/[0.15] text-zinc-300 hover:text-white h-8 w-8 p-0">
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Link href="/create-offer" className="block">
                  <div className="border-2 border-dashed border-white/[0.1] rounded-xl p-8 flex flex-col items-center justify-center hover:border-violet-500/40 hover:bg-violet-500/[0.05] transition-all duration-200 cursor-pointer group">
                    <Plus className="w-8 h-8 text-zinc-600 group-hover:text-violet-400 mb-2 transition-colors" />
                    <p className="text-zinc-500 group-hover:text-zinc-300 text-sm transition-colors">أضف خدمة جديدة</p>
                  </div>
                </Link>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
