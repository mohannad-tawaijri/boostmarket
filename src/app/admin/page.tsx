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
    { label: 'Total Users', value: '0', icon: Users, color: 'from-blue-500 to-cyan-500', trend: '+0%' },
    { label: 'Total Orders', value: '0', icon: ShoppingBag, color: 'from-green-500 to-emerald-500', trend: '+0%' },
    { label: 'Active Chats', value: '0', icon: MessageSquare, color: 'from-purple-500 to-pink-500', trend: '+0%' },
    { label: 'Revenue', value: '$0', icon: DollarSign, color: 'from-yellow-500 to-orange-500', trend: '+0%' },
  ];

  const recentActivity: { id: number; type: string; message: string; time: string; status: string }[] = [];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'chats', label: 'All Chats', icon: MessageSquare },
    { id: 'disputes', label: 'Disputes', icon: AlertTriangle },
  ];

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-6">You don't have permission to access this page.</p>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <span className="px-3 py-1 text-xs rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                Admin Access
              </span>
            </div>
            <p className="text-gray-400">Manage users, orders, and monitor all platform activity</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {adminStats.map((stat, index) => (
            <div
              key={index}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-green-400 text-xs mt-1">{stat.trend} this month</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-800 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-slate-800'
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
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No recent activity</p>
                  <p className="text-gray-500 text-sm">Activity will appear here once users start using the platform</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg">
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
                        <p className="text-gray-500 text-xs">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveTab('users')}
                  className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-all text-left"
                >
                  <Users className="w-8 h-8 text-blue-400 mb-2" />
                  <p className="text-white font-medium">Manage Users</p>
                  <p className="text-gray-500 text-sm">View & edit users</p>
                </button>
                <button
                  onClick={() => setActiveTab('chats')}
                  className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-all text-left"
                >
                  <MessageSquare className="w-8 h-8 text-purple-400 mb-2" />
                  <p className="text-white font-medium">View Chats</p>
                  <p className="text-gray-500 text-sm">Monitor conversations</p>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-all text-left"
                >
                  <ShoppingBag className="w-8 h-8 text-green-400 mb-2" />
                  <p className="text-white font-medium">View Orders</p>
                  <p className="text-gray-500 text-sm">Track all orders</p>
                </button>
                <button
                  onClick={() => setActiveTab('disputes')}
                  className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-all text-left"
                >
                  <AlertTriangle className="w-8 h-8 text-yellow-400 mb-2" />
                  <p className="text-white font-medium">Disputes</p>
                  <p className="text-gray-500 text-sm">Resolve issues</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">All Users</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No users yet</p>
              <p className="text-gray-500 text-sm">Users will appear here once they register</p>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">All Orders</h2>
              <select className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No orders yet</p>
              <p className="text-gray-500 text-sm">Orders will appear here once users start placing them</p>
            </div>
          </div>
        )}

        {activeTab === 'chats' && (
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">All Conversations</h2>
              <p className="text-gray-400 text-sm">Monitor all user conversations for safety</p>
            </div>
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No conversations yet</p>
              <p className="text-gray-500 text-sm">Conversations will appear here once users start chatting</p>
            </div>
          </div>
        )}

        {activeTab === 'disputes' && (
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Disputes & Reports</h2>
              <p className="text-gray-400 text-sm">Handle user complaints and order disputes</p>
            </div>
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <p className="text-gray-400">No open disputes</p>
              <p className="text-gray-500 text-sm">All clear! No issues to resolve</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
