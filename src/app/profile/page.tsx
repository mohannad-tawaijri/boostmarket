'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Shield, 
  CreditCard,
  Save,
  Camera,
  Gamepad2
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#0c0c0f] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-zinc-400">Manage your profile and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-4">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeSection === section.id
                        ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-6">
              {activeSection === 'profile' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center gap-6 pb-6 border-b border-zinc-800/60">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-violet-600 flex items-center justify-center">
                        <Gamepad2 className="w-12 h-12 text-white" />
                      </div>
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 p-2 bg-zinc-800 rounded-full border border-zinc-700 hover:bg-zinc-700 transition-colors"
                      >
                        <Camera className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">{user?.name || 'Your Name'}</h2>
                      <p className="text-zinc-400">{user?.email || 'your@email.com'}</p>
                      {user?.isAdmin && (
                        <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-red-500/20 text-red-400">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Display Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full bg-zinc-800/40 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full bg-zinc-800/40 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell others about yourself..."
                      className="w-full bg-zinc-800/40 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" className="gap-2">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              )}

              {activeSection === 'security' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="pb-6 border-b border-zinc-800/60">
                    <h2 className="text-xl font-semibold text-white mb-2">Change Password</h2>
                    <p className="text-zinc-400">Update your password to keep your account secure</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Current Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className="w-full bg-zinc-800/40 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="w-full bg-zinc-800/40 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Confirm New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full bg-zinc-800/40 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" className="gap-2">
                      <Save className="w-4 h-4" />
                      Update Password
                    </Button>
                  </div>
                </form>
              )}

              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  <div className="pb-6 border-b border-zinc-800/60">
                    <h2 className="text-xl font-semibold text-white mb-2">Notification Preferences</h2>
                    <p className="text-zinc-400">Manage how you receive notifications</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: 'Email notifications', description: 'Receive updates via email' },
                      { label: 'Order updates', description: 'Get notified about order status changes' },
                      { label: 'New messages', description: 'Receive alerts for new chat messages' },
                      { label: 'Marketing emails', description: 'Receive promotional offers and news' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-zinc-800/20 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{item.label}</p>
                          <p className="text-zinc-500 text-sm">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={index < 3} />
                          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'payment' && (
                <div className="space-y-6">
                  <div className="pb-6 border-b border-zinc-800/60">
                    <h2 className="text-xl font-semibold text-white mb-2">Payment Methods</h2>
                    <p className="text-zinc-400">Manage your payment information</p>
                  </div>

                  <div className="p-6 bg-zinc-800/20 rounded-lg border border-dashed border-zinc-700 text-center">
                    <CreditCard className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
                    <p className="text-zinc-400 mb-4">No payment methods added yet</p>
                    <Button variant="outline">Add Payment Method</Button>
                  </div>
                </div>
              )}

              {activeSection === 'privacy' && (
                <div className="space-y-6">
                  <div className="pb-6 border-b border-zinc-800/60">
                    <h2 className="text-xl font-semibold text-white mb-2">Privacy Settings</h2>
                    <p className="text-zinc-400">Control your privacy preferences</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: 'Show profile publicly', description: 'Allow others to view your profile' },
                      { label: 'Show online status', description: 'Let others see when you are online' },
                      { label: 'Allow messages from anyone', description: 'Receive messages from non-contacts' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-zinc-800/20 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{item.label}</p>
                          <p className="text-zinc-500 text-sm">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-zinc-800/60">
                    <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
