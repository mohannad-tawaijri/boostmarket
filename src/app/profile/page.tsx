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
    { id: 'profile', label: 'الملف الشخصي', icon: User },
    { id: 'security', label: 'الأمان', icon: Lock },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'payment', label: 'الدفع', icon: CreditCard },
    { id: 'privacy', label: 'الخصوصية', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-transparent py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">إعدادات الحساب</h1>
          <p className="text-zinc-400">أدر ملفك الشخصي وتفضيلاتك</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeSection === section.id
                        ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20'
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
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
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
              {activeSection === 'profile' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center gap-6 pb-6 border-b border-white/[0.06]">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-violet-600 flex items-center justify-center">
                        <Gamepad2 className="w-12 h-12 text-white" />
                      </div>
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 p-2 bg-white/[0.06] rounded-full border border-white/[0.08] hover:bg-zinc-700 transition-colors"
                      >
                        <Camera className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">{user?.name || 'اسمك'}</h2>
                      <p className="text-zinc-400">{user?.email || 'بريدك@email.com'}</p>
                      {user?.isAdmin && (
                        <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-red-500/20 text-red-400">
                          مدير
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">اسم العرض</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">البريد الإلكتروني</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">نبذة عنك</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      placeholder="أخبر الآخرين عن نفسك..."
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" className="gap-2">
                      <Save className="w-4 h-4" />
                      حفظ التغييرات
                    </Button>
                  </div>
                </form>
              )}

              {activeSection === 'security' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="pb-6 border-b border-white/[0.06]">
                    <h2 className="text-xl font-semibold text-white mb-2">تغيير كلمة المرور</h2>
                    <p className="text-zinc-400">حدّث كلمة مرورك للحفاظ على أمان حسابك</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">كلمة المرور الحالية</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">كلمة المرور الجديدة</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">تأكيد كلمة المرور الجديدة</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" className="gap-2">
                      <Save className="w-4 h-4" />
                      تحديث كلمة المرور
                    </Button>
                  </div>
                </form>
              )}

              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  <div className="pb-6 border-b border-white/[0.06]">
                    <h2 className="text-xl font-semibold text-white mb-2">تفضيلات الإشعارات</h2>
                    <p className="text-zinc-400">أدر كيفية تلقي الإشعارات</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: 'إشعارات البريد الإلكتروني', description: 'تلقي التحديثات عبر البريد' },
                      { label: 'تحديثات الطلبات', description: 'احصل على إشعارات بتغييرات حالة الطلب' },
                      { label: 'رسائل جديدة', description: 'تلقي تنبيهات للرسائل الجديدة' },
                      { label: 'رسائل تسويقية', description: 'تلقي العروض الترويجية والأخبار' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-lg">
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
                  <div className="pb-6 border-b border-white/[0.06]">
                    <h2 className="text-xl font-semibold text-white mb-2">طرق الدفع</h2>
                    <p className="text-zinc-400">أدر معلومات الدفع الخاصة بك</p>
                  </div>

                  <div className="p-6 bg-white/[0.02] rounded-lg border border-dashed border-white/[0.08] text-center">
                    <CreditCard className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
                    <p className="text-zinc-400 mb-4">لم تتم إضافة طرق دفع بعد</p>
                    <Button variant="outline">إضافة طريقة دفع</Button>
                  </div>
                </div>
              )}

              {activeSection === 'privacy' && (
                <div className="space-y-6">
                  <div className="pb-6 border-b border-white/[0.06]">
                    <h2 className="text-xl font-semibold text-white mb-2">إعدادات الخصوصية</h2>
                    <p className="text-zinc-400">تحكم بتفضيلات خصوصيتك</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: 'إظهار الملف الشخصي للعامة', description: 'السماح للآخرين بعرض ملفك الشخصي' },
                      { label: 'إظهار حالة الاتصال', description: 'السماح للآخرين برؤية حالة اتصالك' },
                      { label: 'السماح بالرسائل من الجميع', description: 'تلقي رسائل من غير جهات الاتصال' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-lg">
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

                  <div className="pt-6 border-t border-white/[0.06]">
                    <h3 className="text-lg font-semibold text-red-400 mb-4">منطقة الخطر</h3>
                    <Button variant="destructive">حذف الحساب</Button>
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
