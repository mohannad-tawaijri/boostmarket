'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Plus,
  ArrowRight,
  Gamepad2,
  TrendingUp,
  MessageSquare
} from 'lucide-react';

// Orders and offers will be fetched from the API
const mockOrders: { id: number; service: string; status: string; price: number; date: string }[] = [];
const mockOffers: { id: number; title: string; game: string; orders: number; earnings: number }[] = [];

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'offers'>('overview');

  const stats = [
    { label: 'Total Orders', value: '0', icon: ShoppingBag, color: 'from-blue-500 to-cyan-500' },
    { label: 'Total Earnings', value: '$0', icon: DollarSign, color: 'from-green-500 to-emerald-500' },
    { label: 'In Progress', value: '0', icon: Clock, color: 'from-yellow-500 to-orange-500' },
    { label: 'Completed', value: '0', icon: CheckCircle, color: 'from-purple-500 to-pink-500' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">Completed</span>;
      case 'in_progress':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400">In Progress</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">Pending</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{user?.name || 'Gamer'}</span>
            </h1>
            <p className="text-gray-400">Here's what's happening with your account</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <Link href="/create-offer">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create Offer
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
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
        <div className="flex gap-2 mb-6 border-b border-slate-800 pb-4">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'orders', label: 'My Orders', icon: ShoppingBag },
            { id: 'offers', label: 'My Offers', icon: Gamepad2 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
                <Link href="/orders" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {mockOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium text-sm">{order.service}</p>
                      <p className="text-gray-500 text-xs">{order.date}</p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(order.status)}
                      <p className="text-gray-400 text-sm mt-1">${order.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/services" className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-all group">
                  <ShoppingBag className="w-8 h-8 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-white font-medium">Browse Offers</p>
                  <p className="text-gray-500 text-sm">Find boosting services</p>
                </Link>
                <Link href="/create-offer" className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-all group">
                  <Plus className="w-8 h-8 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-white font-medium">Create Offer</p>
                  <p className="text-gray-500 text-sm">Start selling services</p>
                </Link>
                <Link href="/orders" className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-all group">
                  <Clock className="w-8 h-8 text-yellow-400 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-white font-medium">Track Orders</p>
                  <p className="text-gray-500 text-sm">View order status</p>
                </Link>
                <Link href="/profile" className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-all group">
                  <MessageSquare className="w-8 h-8 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-white font-medium">Messages</p>
                  <p className="text-gray-500 text-sm">Chat with users</p>
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="text-left text-gray-400 font-medium px-6 py-4">Service</th>
                    <th className="text-left text-gray-400 font-medium px-6 py-4">Status</th>
                    <th className="text-left text-gray-400 font-medium px-6 py-4">Price</th>
                    <th className="text-left text-gray-400 font-medium px-6 py-4">Date</th>
                    <th className="text-left text-gray-400 font-medium px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {mockOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-white">{order.service}</td>
                      <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                      <td className="px-6 py-4 text-gray-300">${order.price}</td>
                      <td className="px-6 py-4 text-gray-400">{order.date}</td>
                      <td className="px-6 py-4">
                        <Button variant="outline" size="sm">View Details</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'offers' && (
          <div className="space-y-4">
            {mockOffers.map((offer) => (
              <div key={offer.id} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold text-lg">{offer.title}</h3>
                  <p className="text-gray-400">{offer.game}</p>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{offer.orders}</p>
                    <p className="text-gray-500 text-sm">Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">${offer.earnings}</p>
                    <p className="text-gray-500 text-sm">Earnings</p>
                  </div>
                  <Button variant="outline">Edit Offer</Button>
                </div>
              </div>
            ))}
            <Link href="/create-offer">
              <div className="bg-slate-900/30 border-2 border-dashed border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center hover:border-indigo-500/50 transition-colors cursor-pointer">
                <Plus className="w-12 h-12 text-gray-500 mb-2" />
                <p className="text-gray-400">Create New Offer</p>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
