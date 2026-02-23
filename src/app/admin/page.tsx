'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  ShoppingBag, 
  MessageSquare, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Shield,
  TrendingUp,
  Clock
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'orders' | 'chats' | 'disputes'>('overview');

  // Redirect non-admin users
  useEffect(() => {
    if (user && !user.isAdmin) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Mock data for admin view - will be replaced with real API calls
  const adminStats = [
    { label: 'إجمالي المستخدمين', value: '0', icon: Users, color: 'text-blue-400', trend: '+0%' },
    { label: 'إجمالي الطلبات', value: '0', icon: ShoppingBag, color: 'text-emerald-400', trend: '+0%' },
    { label: 'المحادثات النشطة', value: '0', icon: MessageSquare, color: 'text-violet-400', trend: '+0%' },
    { label: 'الإيرادات', value: '$0', icon: DollarSign, color: 'text-amber-400', trend: '+0%' },
  ];

  const recentActivity: { id: number; type: string; message: string; time: string; status: string }[] = [];

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: TrendingUp },
    { id: 'users', label: 'المستخدمون', icon: Users },
    { id: 'orders', label: 'الطلبات', icon: ShoppingBag },
    { id: 'chats', label: 'جميع المحادثات', icon: MessageSquare },
    { id: 'disputes', label: 'النزاعات', icon: AlertTriangle },
  ];

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">الوصول مرفوض</h1>
          <p className="text-zinc-400 mb-6">ليس لديك صلاحية للوصول إلى هذه الصفحة.</p>
          <Link href="/dashboard">
            <Button>الذهاب للوحة التحكم</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">لوحة تحكم المدير</h1>
              <span className="px-3 py-1 text-xs rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                وصول المدير
              </span>
            </div>
            <p className="text-zinc-400">إدارة المستخدمين والطلبات ومراقبة جميع أنشطة المنصة</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {adminStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 hover:border-white/[0.08] transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-green-400 text-xs mt-1">{stat.trend} هذا الشهر</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-white/[0.06] pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">النشاط الأخير</h2>
              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-zinc-400">لا يوجد نشاط حديث</p>
                  <p className="text-zinc-500 text-sm">سيظهر النشاط هنا بمجرد أن يبدأ المستخدمون باستخدام المنصة</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-white/[0.02] rounded-lg">
                      <div className={`p-2 rounded-lg ${
                        activity.status === 'success' ? 'bg-green-500/20' : 
                        activity.status === 'warning' ? 'bg-yellow-500/20' : 'bg-red-500/20'
                      }`}>
                        {activity.status === 'success' ? <CheckCircle className="w-4 h-4 text-green-400" /> :
                         activity.status === 'warning' ? <AlertTriangle className="w-4 h-4 text-yellow-400" /> :
                         <XCircle className="w-4 h-4 text-red-400" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm">{activity.message}</p>
                        <p className="text-zinc-500 text-xs">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">إجراءات سريعة</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveTab('users')}
                  className="p-4 bg-white/[0.04] rounded-lg hover:bg-white/[0.06] transition-all text-left"
                >
                  <Users className="w-8 h-8 text-blue-400 mb-2" />
                  <p className="text-white font-medium">إدارة المستخدمين</p>
                  <p className="text-zinc-500 text-sm">عرض وتعديل المستخدمين</p>
                </button>
                <button
                  onClick={() => setActiveTab('chats')}
                  className="p-4 bg-white/[0.04] rounded-lg hover:bg-white/[0.06] transition-all text-left"
                >
                  <MessageSquare className="w-8 h-8 text-purple-400 mb-2" />
                  <p className="text-white font-medium">عرض المحادثات</p>
                  <p className="text-zinc-500 text-sm">مراقبة المحادثات</p>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="p-4 bg-white/[0.04] rounded-lg hover:bg-white/[0.06] transition-all text-left"
                >
                  <ShoppingBag className="w-8 h-8 text-green-400 mb-2" />
                  <p className="text-white font-medium">عرض الطلبات</p>
                  <p className="text-zinc-500 text-sm">تتبع جميع الطلبات</p>
                </button>
                <button
                  onClick={() => setActiveTab('disputes')}
                  className="p-4 bg-white/[0.04] rounded-lg hover:bg-white/[0.06] transition-all text-left"
                >
                  <AlertTriangle className="w-8 h-8 text-yellow-400 mb-2" />
                  <p className="text-white font-medium">النزاعات</p>
                  <p className="text-zinc-500 text-sm">حل المشكلات</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">جميع المستخدمين</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="بحث عن مستخدمين..."
                  className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-zinc-400">لا يوجد مستخدمون بعد</p>
              <p className="text-zinc-500 text-sm">سيظهر المستخدمون هنا بمجرد التسجيل</p>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">جميع الطلبات</h2>
              <select className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option value="all">جميع الحالات</option>
                <option value="pending">قيد الانتظار</option>
                <option value="in_progress">قيد التنفيذ</option>
                <option value="completed">مكتمل</option>
                <option value="cancelled">ملغي</option>
              </select>
            </div>
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-zinc-400">لا يوجد طلبات بعد</p>
              <p className="text-zinc-500 text-sm">ستظهر الطلبات هنا بمجرد أن يبدأ المستخدمون بتقديمها</p>
            </div>
          </div>
        )}

        {activeTab === 'chats' && (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">جميع المحادثات</h2>
              <p className="text-zinc-400 text-sm">مراقبة جميع محادثات المستخدمين للسلامة</p>
            </div>
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-zinc-400">لا يوجد محادثات بعد</p>
              <p className="text-zinc-500 text-sm">ستظهر المحادثات هنا بمجرد أن يبدأ المستخدمون بالتواصل</p>
            </div>
          </div>
        )}

        {activeTab === 'disputes' && (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">النزاعات والبلاغات</h2>
              <p className="text-zinc-400 text-sm">التعامل مع شكاوى المستخدمين ونزاعات الطلبات</p>
            </div>
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <p className="text-zinc-400">لا يوجد نزاعات مفتوحة</p>
              <p className="text-zinc-500 text-sm">كل شيء على ما يرام! لا توجد مشكلات</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
