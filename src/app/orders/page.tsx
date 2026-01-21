'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Gamepad2,
  ArrowRight
} from 'lucide-react';

// Orders will be fetched from the API
const mockOrders: {
  id: string;
  service: string;
  game: string;
  booster: string;
  status: string;
  price: number;
  createdAt: string;
  progress: number;
  currentRank: string;
  targetRank: string;
}[] = [];

export default function OrdersPage() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed' | 'pending' | 'cancelled'>('all');

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20', label: 'Completed' };
      case 'in_progress':
        return { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'In Progress' };
      case 'pending':
        return { icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Pending' };
      case 'cancelled':
        return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Cancelled' };
      default:
        return { icon: Package, color: 'text-gray-400', bg: 'bg-gray-500/20', label: status };
    }
  };

  const filteredOrders = filter === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === filter);

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Orders</h1>
            <p className="text-gray-400">Track and manage your boosting orders</p>
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
            { id: 'in_progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
            { id: 'pending', label: 'Pending' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id as typeof filter)}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === filterOption.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'bg-slate-800/50 text-gray-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-12 text-center">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No orders found</h3>
              <p className="text-gray-400 mb-6">You don't have any orders matching this filter</p>
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
                  className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all"
                >
                  {/* Order Header */}
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <Gamepad2 className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{order.service}</h3>
                          <p className="text-gray-400 text-sm">{order.game} • {order.id}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.bg}`}>
                          <statusConfig.icon className={`w-4 h-4 ${statusConfig.color}`} />
                          <span className={`text-sm font-medium ${statusConfig.color}`}>{statusConfig.label}</span>
                        </div>
                        <div className="text-right hidden sm:block">
                          <p className="text-white font-semibold">${order.price}</p>
                          <p className="text-gray-500 text-sm">{order.createdAt}</p>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Progress Bar for in-progress orders */}
                    {order.status === 'in_progress' && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-indigo-400">{order.progress}%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500"
                            style={{ width: `${order.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-slate-800 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <p className="text-gray-500 text-sm mb-1">Booster</p>
                          <p className="text-white font-medium">{order.booster}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm mb-1">Current Rank</p>
                          <p className="text-white font-medium">{order.currentRank}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm mb-1">Target Rank</p>
                          <p className="text-indigo-400 font-medium">{order.targetRank}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-6">
                        <Button variant="outline" className="gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Message Booster
                        </Button>
                        <Button variant="ghost" className="gap-2">
                          View Details
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                        {order.status === 'pending' && (
                          <Button variant="destructive">Cancel Order</Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
