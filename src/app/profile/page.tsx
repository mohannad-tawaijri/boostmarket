'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { API_URL } from '@/lib/config';
import AvatarInspect from '@/components/avatar-inspect';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Shield, 
  CreditCard,
  Save,
  Camera,
  Trash2,
  Gamepad2,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

interface UserPreferences {
  notifyEmail: boolean;
  notifyOrders: boolean;
  notifyMessages: boolean;
  notifyMarketing: boolean;
  showProfile: boolean;
  showOnlineStatus: boolean;
  showReadReceipts: boolean;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSection, setActiveSection] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [preferences, setPreferences] = useState<UserPreferences>({
    notifyEmail: true,
    notifyOrders: true,
    notifyMessages: true,
    notifyMarketing: false,
    showProfile: true,
    showOnlineStatus: true,
    showReadReceipts: true,
  });

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token || !user) return;

      try {
        const res = await fetch(`${API_URL}/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.name || '',
            email: data.email || '',
            bio: data.bio || '',
          });
          setAvatarUrl(data.avatar || null);
          setPreferences({
            notifyEmail: data.notifyEmail ?? true,
            notifyOrders: data.notifyOrders ?? true,
            notifyMessages: data.notifyMessages ?? true,
            notifyMarketing: data.notifyMarketing ?? false,
            showProfile: data.showProfile ?? true,
            showOnlineStatus: data.showOnlineStatus ?? true,
            showReadReceipts: data.showReadReceipts ?? true,
          });
        }
      } catch {
        // Fallback to context data
        setFormData({
          name: user.name || '',
          email: user.email || '',
          bio: '',
        });
      }
    };
    loadUserData();
  }, [user]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // --- Profile save ---
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) return;

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: formData.name, bio: formData.bio }),
      });

      if (res.ok) {
        showToast('تم حفظ التغييرات بنجاح', 'success');
      } else {
        const data = await res.json();
        showToast(data.message || 'فشل في حفظ التغييرات', 'error');
      }
    } catch {
      showToast('حدث خطأ في الاتصال', 'error');
    } finally {
      setSaving(false);
    }
  };

  // --- Avatar upload ---
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem('authToken');
    if (!token) return;

    setUploadingAvatar(true);
    try {
      // Upload image
      const uploadForm = new FormData();
      uploadForm.append('file', file);

      const uploadRes = await fetch(`${API_URL}/upload/image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: uploadForm,
      });

      if (!uploadRes.ok) {
        const data = await uploadRes.json();
        showToast(data.message || 'فشل في رفع الصورة', 'error');
        return;
      }

      const { url } = await uploadRes.json();

      // Update user profile with new avatar
      const profileRes = await fetch(`${API_URL}/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar: url }),
      });

      if (profileRes.ok) {
        setAvatarUrl(url);
        showToast('تم تحديث الصورة الشخصية', 'success');
      } else {
        showToast('فشل في تحديث الصورة', 'error');
      }
    } catch {
      showToast('حدث خطأ في رفع الصورة', 'error');
    } finally {
      setUploadingAvatar(false);
      // Reset input so re-selecting the same file triggers onChange
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // --- Delete avatar ---
  const handleAvatarDelete = async () => {
    const token = localStorage.getItem('authToken');
    if (!token || !avatarUrl) return;

    setUploadingAvatar(true);
    try {
      const res = await fetch(`${API_URL}/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar: null }),
      });

      if (res.ok) {
        setAvatarUrl(null);
        showToast('تم حذف الصورة الشخصية', 'success');
      } else {
        showToast('فشل في حذف الصورة', 'error');
      }
    } catch {
      showToast('حدث خطأ في حذف الصورة', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // --- Change password ---
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('كلمة المرور الجديدة غير متطابقة', 'error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) return;

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (res.ok) {
        showToast('تم تغيير كلمة المرور بنجاح', 'success');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const data = await res.json();
        showToast(data.message || 'فشل في تغيير كلمة المرور', 'error');
      }
    } catch {
      showToast('حدث خطأ في الاتصال', 'error');
    } finally {
      setSaving(false);
    }
  };

  // --- Notification / Privacy toggle ---
  const handlePreferenceToggle = async (key: keyof UserPreferences) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    const newValue = !preferences[key];
    setPreferences((prev) => ({ ...prev, [key]: newValue }));

    try {
      const res = await fetch(`${API_URL}/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [key]: newValue }),
      });

      if (!res.ok) {
        // Revert on failure
        setPreferences((prev) => ({ ...prev, [key]: !newValue }));
        showToast('فشل في حفظ التفضيل', 'error');
      }
    } catch {
      setPreferences((prev) => ({ ...prev, [key]: !newValue }));
      showToast('حدث خطأ في الاتصال', 'error');
    }
  };

  const sections = [
    { id: 'profile', label: 'البروفايل', icon: User },
    { id: 'security', label: 'الأمان', icon: Lock },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'payment', label: 'الدفع', icon: CreditCard },
    { id: 'privacy', label: 'الخصوصية', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-transparent py-8">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg border ${
          toast.type === 'success'
            ? 'bg-green-900/80 border-green-500/30 text-green-200'
            : 'bg-red-900/80 border-red-500/30 text-red-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">الإعدادات</h1>
          <p className="text-zinc-400">عدّل بياناتك وتفضيلاتك</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/[0.09] border border-white/[0.15] rounded-xl p-4">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeSection === section.id
                        ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20'
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.07]'
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
            <div className="bg-white/[0.09] border border-white/[0.15] rounded-xl p-6">
              {activeSection === 'profile' && (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="flex items-center gap-6 pb-6 border-b border-white/[0.15]">
                    <div className="relative">
                      {avatarUrl ? (
                        <AvatarInspect src={avatarUrl} alt={formData.name}>
                          <img
                            src={avatarUrl}
                            alt={formData.name}
                            className="w-24 h-24 rounded-full object-cover hover:opacity-80 transition-opacity"
                          />
                        </AvatarInspect>
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-violet-600 flex items-center justify-center">
                          <Gamepad2 className="w-12 h-12 text-white" />
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                      <button
                        type="button"
                        onClick={handleAvatarClick}
                        disabled={uploadingAvatar}
                        className="absolute bottom-0 right-0 p-2 bg-white/[0.09] rounded-full border border-white/[0.18] hover:bg-zinc-700 transition-colors disabled:opacity-50"
                        aria-label="تغيير الصورة الشخصية"
                      >
                        {uploadingAvatar ? (
                          <Loader2 className="w-4 h-4 text-white animate-spin" />
                        ) : (
                          <Camera className="w-4 h-4 text-white" />
                        )}
                      </button>
                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={handleAvatarDelete}
                          disabled={uploadingAvatar}
                          className="absolute top-0 right-0 p-1.5 bg-red-500/80 rounded-full border border-red-400/30 hover:bg-red-500 transition-colors disabled:opacity-50"
                          aria-label="حذف الصورة الشخصية"
                        >
                          <Trash2 className="w-3 h-3 text-white" />
                        </button>
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">{formData.name || 'اسمك'}</h2>
                      <p className="text-zinc-400">{formData.email || 'بريدك@email.com'}</p>
                      {user?.isAdmin && (
                        <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-red-500/20 text-red-400">
                          مدير
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">اسم العرض</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" aria-hidden="true" />
                        <input
                          id="name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full bg-white/[0.07] border border-white/[0.18] rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">البريد الإلكتروني</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" aria-hidden="true" />
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={formData.email}
                          disabled
                          className="w-full bg-white/[0.07] border border-white/[0.18] rounded-lg pl-10 pr-4 py-3 text-zinc-400 placeholder-zinc-500 focus:outline-none cursor-not-allowed opacity-60"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-zinc-300 mb-2">نبذة عنك</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      maxLength={500}
                      placeholder="اكتب نبذة عنك..."
                      className="w-full bg-white/[0.07] border border-white/[0.18] rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-zinc-500 mt-1 text-left">{formData.bio.length}/500</p>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={saving} className="gap-2">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      حفظ التغييرات
                    </Button>
                  </div>
                </form>
              )}

              {activeSection === 'security' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="pb-6 border-b border-white/[0.15]">
                    <h2 className="text-xl font-semibold text-white mb-2">تغيير كلمة المرور</h2>
                    <p className="text-zinc-400">حدّث كلمة مرورك للحفاظ على أمان حسابك</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-zinc-300 mb-2">كلمة المرور الحالية</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" aria-hidden="true" />
                        <input
                          id="currentPassword"
                          type="password"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                          className="w-full bg-white/[0.07] border border-white/[0.18] rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-zinc-300 mb-2">كلمة المرور الجديدة</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" aria-hidden="true" />
                        <input
                          id="newPassword"
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                          minLength={6}
                          className="w-full bg-white/[0.07] border border-white/[0.18] rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-2">تأكيد كلمة المرور الجديدة</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" aria-hidden="true" />
                        <input
                          id="confirmPassword"
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                          minLength={6}
                          className="w-full bg-white/[0.07] border border-white/[0.18] rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={saving} className="gap-2">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      تحديث كلمة المرور
                    </Button>
                  </div>
                </form>
              )}

              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  <div className="pb-6 border-b border-white/[0.15]">
                    <h2 className="text-xl font-semibold text-white mb-2">تفضيلات الإشعارات</h2>
                    <p className="text-zinc-400">أدر كيفية تلقي الإشعارات</p>
                  </div>

                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">قريباً</h3>
                    <p className="text-zinc-400 text-sm max-w-sm mx-auto">نعمل على إضافة إشعارات البريد الإلكتروني وتنبيهات الطلبات. سيتم تفعيل هذه الخيارات قريباً.</p>
                  </div>
                </div>
              )}

              {activeSection === 'payment' && (
                <div className="space-y-6">
                  <div className="pb-6 border-b border-white/[0.15]">
                    <h2 className="text-xl font-semibold text-white mb-2">طرق الدفع</h2>
                    <p className="text-zinc-400">أدر معلومات الدفع الخاصة بك</p>
                  </div>

                  <div className="p-6 bg-white/[0.07] rounded-lg border border-dashed border-white/[0.18] text-center">
                    <CreditCard className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
                    <p className="text-zinc-400 mb-4">لم تتم إضافة طرق دفع بعد</p>
                    <Button variant="outline">إضافة طريقة دفع</Button>
                  </div>
                </div>
              )}

              {activeSection === 'privacy' && (
                <div className="space-y-6">
                  <div className="pb-6 border-b border-white/[0.15]">
                    <h2 className="text-xl font-semibold text-white mb-2">إعدادات الخصوصية</h2>
                    <p className="text-zinc-400">تحكم بتفضيلات خصوصيتك</p>
                  </div>

                  <div className="space-y-4">
                    {([
                      { key: 'showProfile' as const, label: 'إظهار الملف الشخصي للعامة', description: 'السماح للآخرين بعرض ملفك الشخصي' },
                      { key: 'showOnlineStatus' as const, label: 'إظهار حالة الاتصال', description: 'السماح للآخرين برؤية حالة اتصالك' },
                      { key: 'showReadReceipts' as const, label: 'إظهار إيصالات القراءة', description: 'السماح للآخرين بمعرفة أنك قرأت رسائلهم' },
                    ]).map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-white/[0.07] rounded-lg">
                        <div>
                          <p className="text-white font-medium">{item.label}</p>
                          <p className="text-zinc-500 text-sm">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={preferences[item.key]}
                            onChange={() => handlePreferenceToggle(item.key)}
                          />
                          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-white/[0.15]">
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
