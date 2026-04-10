'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { API_URL } from '@/lib/config';
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
  Trash2,
  Package,
  ShoppingCart,
  Eye,
  EyeOff
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-violet-400 animate-spin" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const validTabs = ['overview', 'orders', 'customer-orders', 'offers'] as const;
  const initialTab = validTabs.includes(tabParam as typeof validTabs[number]) ? tabParam as typeof validTabs[number] : 'overview';
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'customer-orders' | 'offers'>(initialTab);
  const [myOrders, setMyOrders] = useState<Order[]>([]); // Orders I placed (as buyer)
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]); // Orders on my services (as booster)
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user's offers (services they created)
        const servicesRes = await fetch(`${API_URL}/services/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          setOffers(servicesData);
        }

        // Fetch orders I placed (as buyer)
        const myOrdersRes = await fetch(`${API_URL}/orders?role=buyer`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (myOrdersRes.ok) {
          const myOrdersData = await myOrdersRes.json();
          setMyOrders(myOrdersData);
        }

        // Fetch orders on my services (as booster/seller)
        const customerOrdersRes = await fetch(`${API_URL}/orders?role=booster`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (customerOrdersRes.ok) {
          const customerOrdersData = await customerOrdersRes.json();
          setCustomerOrders(customerOrdersData);
        }
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

  const inProgressOrders = [...myOrders, ...customerOrders].filter(o => o.status === 'IN_PROGRESS').length;
  const completedOrders = [...myOrders, ...customerOrders].filter(o => o.status === 'COMPLETED').length;

  const stats = [
    { label: 'طلباتي', value: myOrders.length.toString(), icon: ShoppingBag, color: 'text-blue-400' },
    { label: 'طلبات العملاء', value: customerOrders.length.toString(), icon: DollarSign, color: 'text-emerald-400' },
    { label: 'عروضي', value: offers.length.toString(), icon: Gamepad2, color: 'text-amber-400' },
    { label: 'مكتمل', value: completedOrders.toString(), icon: CheckCircle, color: 'text-violet-400' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">مكتمل</span>;
      case 'IN_PROGRESS':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400">قيد التنفيذ</span>;
      case 'PENDING':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">قيد الانتظار</span>;
      case 'CANCELLED':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400">ملغي</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-zinc-400">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              مرحباً بعودتك، <span className="text-violet-400">{user?.name || 'لاعب'}</span>
            </h1>
            <p className="text-zinc-400">نظرة على حسابك</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <Link href="/create-offer">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                أضف خدمة
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/[0.09] border border-white/[0.15] rounded-xl p-6 hover:border-white/[0.18] transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/[0.15] pb-4 overflow-x-auto">
          {[
            { id: 'overview', label: 'الرئيسية', icon: TrendingUp },
            { id: 'orders', label: 'طلباتي', icon: ShoppingBag },
            { id: 'customer-orders', label: 'طلبات العملاء', icon: DollarSign },
            { id: 'offers', label: 'عروضي', icon: Gamepad2 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-violet-600 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Orders columns — stacked, take 2/3 width */}
            <div className="lg:col-span-2 space-y-4">
              {/* My Orders (as buyer) */}
              <div className="bg-white/[0.09] border border-white/[0.15] rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-semibold text-white">طلباتي</h2>
                  <button onClick={() => setActiveTab('orders')} className="text-violet-400 hover:text-violet-300 text-xs flex items-center gap-1">
                    الكل <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {loading ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
                  </div>
                ) : myOrders.length === 0 ? (
                  <div className="flex items-center gap-3 py-4 text-zinc-400 text-sm">
                    <ShoppingBag className="w-5 h-5 flex-shrink-0" />
                    <span>ما طلبت شي بعد —</span>
                    <Link href="/services" className="text-violet-400 hover:underline">استعرض الخدمات</Link>
                  </div>
                ) : (
                  <div className="divide-y divide-white/[0.07]">
                    {myOrders.slice(0, 4).map((order) => (
                      <Link key={order.id} href={`/orders/${order.id}`} className="flex items-center justify-between py-3 hover:bg-white/[0.04] rounded-lg px-2 -mx-2 transition-colors group">
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium truncate group-hover:text-violet-300 transition-colors">{order.service?.title || 'خدمة'}</p>
                          <p className="text-zinc-500 text-xs">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0 ms-3">
                          {getStatusBadge(order.status)}
                          <span className="text-zinc-400 text-sm w-16 text-left">{order.price} ر.س</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Customer Orders (as seller) */}
              <div className="bg-white/[0.09] border border-white/[0.15] rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-semibold text-white">طلبات العملاء</h2>
                  <button onClick={() => setActiveTab('customer-orders')} className="text-violet-400 hover:text-violet-300 text-xs flex items-center gap-1">
                    الكل <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {loading ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
                  </div>
                ) : customerOrders.length === 0 ? (
                  <div className="flex items-center gap-3 py-4 text-zinc-400 text-sm">
                    <DollarSign className="w-5 h-5 flex-shrink-0" />
                    <span>ما جاك أي طلب بعد —</span>
                    <Link href="/create-offer" className="text-violet-400 hover:underline">أضف خدمة</Link>
                  </div>
                ) : (
                  <div className="divide-y divide-white/[0.07]">
                    {customerOrders.slice(0, 4).map((order) => (
                      <Link key={order.id} href={`/orders/${order.id}`} className="flex items-center justify-between py-3 hover:bg-white/[0.04] rounded-lg px-2 -mx-2 transition-colors group">
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium truncate group-hover:text-violet-300 transition-colors">{order.service?.title || 'خدمة'}</p>
                          <p className="text-zinc-500 text-xs">{order.buyer?.name || ''} · {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0 ms-3">
                          {getStatusBadge(order.status)}
                          <span className="text-green-400 text-sm w-16 text-left">{order.price} ر.س</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions — sidebar, 1/3 width */}
            <div className="bg-white/[0.09] border border-white/[0.15] rounded-xl p-5 h-fit">
              <h2 className="text-base font-semibold text-white mb-4">اختصارات</h2>
              <div className="space-y-2">
                <Link href="/services" className="flex items-center gap-3 p-3 bg-white/[0.07] rounded-lg hover:bg-white/[0.11] transition-all group">
                  <ShoppingBag className="w-5 h-5 text-violet-400 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm font-medium">استعرض الخدمات</p>
                    <p className="text-zinc-500 text-xs">شوف خدمات البوست</p>
                  </div>
                </Link>
                <Link href="/create-offer" className="flex items-center gap-3 p-3 bg-white/[0.07] rounded-lg hover:bg-white/[0.11] transition-all group">
                  <Plus className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm font-medium">أضف خدمة</p>
                    <p className="text-zinc-500 text-xs">ابدأ تبيع</p>
                  </div>
                </Link>
                <Link href="/orders" className="flex items-center gap-3 p-3 bg-white/[0.07] rounded-lg hover:bg-white/[0.11] transition-all group">
                  <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm font-medium">طلباتي</p>
                    <p className="text-zinc-500 text-xs">تابع طلباتك</p>
                  </div>
                </Link>
                <Link href="/messages" className="flex items-center gap-3 p-3 bg-white/[0.07] rounded-lg hover:bg-white/[0.11] transition-all group">
                  <MessageSquare className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm font-medium">الرسائل</p>
                    <p className="text-zinc-500 text-xs">ردّ على رسائلك</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white/[0.09] border border-white/[0.15] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.15] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">طلباتي</h2>
                <p className="text-zinc-400 text-sm">خدمات طلبتها من بوسترز</p>
              </div>
              <Link href="/orders">
                <Button variant="outline" size="sm" className="border-white/[0.18] text-zinc-300 hover:text-white">
                  عرض كل الطلبات
                </Button>
              </Link>
            </div>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
              </div>
            ) : myOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-zinc-400 mb-4">ما طلبت شي بعد</p>
                <Link href="/services">
                  <Button>استعرض الخدمات</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/[0.07]">
                    <tr>
                      <th className="text-right text-zinc-400 font-medium px-6 py-4">الخدمة</th>
                      <th className="text-right text-zinc-400 font-medium px-6 py-4">البوستر</th>
                      <th className="text-right text-zinc-400 font-medium px-6 py-4">الحالة</th>
                      <th className="text-right text-zinc-400 font-medium px-6 py-4">السعر</th>
                      <th className="text-right text-zinc-400 font-medium px-6 py-4">التاريخ</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {myOrders.map((order) => (
                      <tr
                        key={order.id}
                        onClick={() => window.location.href = `/orders/${order.id}`}
                        className="hover:bg-white/[0.07] transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 text-white">{order.service?.title || 'Service'}</td>
                        <td className="px-6 py-4 text-zinc-300">{order.booster?.name || 'Booster'}</td>
                        <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                        <td className="px-6 py-4 text-zinc-300">{order.price} ر.س</td>
                        <td className="px-6 py-4 text-zinc-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-violet-400 text-sm">تفاصيل ←</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'customer-orders' && (
          <div className="bg-white/[0.09] border border-white/[0.15] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.15]">
              <h2 className="text-lg font-semibold text-white">طلبات العملاء</h2>
              <p className="text-zinc-400 text-sm">الطلبات اللي جتك من العملاء</p>
            </div>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
              </div>
            ) : customerOrders.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-zinc-400 mb-2">ما جاك أي طلب بعد</p>
                <p className="text-zinc-500 text-sm mb-4">أضف خدمتك وابدأ!</p>
                <Link href="/create-offer">
                  <Button>أضف خدمة</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/[0.07]">
                    <tr>
                      <th className="text-right text-zinc-400 font-medium px-6 py-4">الخدمة</th>
                      <th className="text-right text-zinc-400 font-medium px-6 py-4">العميل</th>
                      <th className="text-right text-zinc-400 font-medium px-6 py-4">الحالة</th>
                      <th className="text-right text-zinc-400 font-medium px-6 py-4">الأرباح</th>
                      <th className="text-right text-zinc-400 font-medium px-6 py-4">التاريخ</th>
                      <th className="text-right text-zinc-400 font-medium px-6 py-4">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {customerOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/[0.07] transition-colors">
                        <td className="px-6 py-4 text-white">{order.service?.title || 'Service'}</td>
                        <td className="px-6 py-4 text-zinc-300">{order.buyer?.name || 'Customer'}</td>
                        <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                        <td className="px-6 py-4 text-green-400">{order.price} ر.س</td>
                        <td className="px-6 py-4 text-zinc-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <Link href={`/orders/${order.id}`}>
                            <Button variant="outline" size="sm">إدارة</Button>
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

        {activeTab === 'offers' && (
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
              </div>
            ) : offers.length === 0 ? (
              <div className="bg-white/[0.09] border border-white/[0.15] rounded-xl p-12 text-center">
                <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">ما عندك خدمات بعد</h3>
                <p className="text-zinc-400 mb-6">ابدأ تبيع خدماتك اليوم!</p>
                <Link href="/create-offer">
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    أضف أول خدمة
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {offers.map((offer) => (
                  <div key={offer.id} className="bg-white/[0.09] border border-white/[0.15] rounded-xl p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-semibold text-lg truncate">{offer.title}</h3>
                          {offer.active ? (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              نشط
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/15 text-red-400 border border-red-500/20 flex items-center gap-1">
                              <EyeOff className="w-3 h-3" />
                              متوقف
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-zinc-400">
                          <span>{offer.game}</span>
                          {offer.category === 'ITEMS' && offer.stock !== null && offer.stock !== undefined && (
                            <span className="flex items-center gap-1">
                              <Package className="w-3.5 h-3.5" />
                              {offer.stock > 0 ? (
                                <span className="text-amber-400">{offer.stock} متبقي</span>
                              ) : (
                                <span className="text-red-400">نفذت الكمية</span>
                              )}
                            </span>
                          )}
                          {offer.allowDirectPurchase && (
                            <span className="flex items-center gap-1 text-green-400">
                              <ShoppingCart className="w-3.5 h-3.5" />
                              شراء مباشر
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">{offer.price} ر.س</p>
                          <p className="text-zinc-500 text-sm">السعر</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/create-offer/${offer.id}`}>
                            <Button variant="outline" size="sm" className="gap-1.5 border-white/[0.18] text-zinc-300 hover:text-white">
                              <Edit3 className="w-4 h-4" />
                              تعديل
                            </Button>
                          </Link>
                          <Link href={`/services/${offer.id}`}>
                            <Button variant="outline" size="sm" className="border-white/[0.18] text-zinc-300 hover:text-white">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Link href="/create-offer" className="mt-4 block">
                  <div className="bg-zinc-900/30 border-2 border-dashed border-white/[0.18] rounded-xl p-8 flex flex-col items-center justify-center hover:border-white/[0.18] transition-colors cursor-pointer">
                    <Plus className="w-12 h-12 text-zinc-500 mb-2" />
                    <p className="text-zinc-400">أضف خدمة جديدة</p>
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
