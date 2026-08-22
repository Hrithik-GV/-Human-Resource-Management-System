import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  User,
  Bell,
  Lock,
  Globe,
  Sliders,
  ShieldCheck,
  Moon,
  Sun,
  Save,
  KeyRound
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PageContainer } from '../components/common/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Tabs } from '../components/ui/Tabs';
import { useAuth } from '../context/AuthContext';

export const SettingsPage = () => {
  const { currentUser, role, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('account');

  // Account Settings Form
  const accountForm = useForm({
    defaultValues: {
      fullName: currentUser?.fullName || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '+1 (555) 234-5678',
      language: 'en-US',
      timezone: 'America/Los_Angeles',
    },
  });

  // Keep Account Form synced with currentUser
  useEffect(() => {
    if (currentUser) {
      accountForm.reset({
        fullName: currentUser.fullName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '+1 (555) 234-5678',
        language: 'en-US',
        timezone: 'America/Los_Angeles',
      });
    }
  }, [currentUser, accountForm]);

  // Notification Settings State
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    attendanceReminders: true,
    leaveUpdates: true,
    payrollDigest: true,
    weeklyReport: false,
  });

  // Security Form
  const securityForm = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // System Preferences State
  const [preferences, setPreferences] = useState({
    theme: localStorage.getItem('dayflow_theme') || 'light',
    density: 'comfortable',
    defaultLanding: role === 'admin' ? '/admin/dashboard' : '/employee/dashboard',
  });

  const handleAccountSubmit = async (formData) => {
    try {
      const savedUser = localStorage.getItem('dayflow_user');
      const user = savedUser ? JSON.parse(savedUser) : {};
      const updated = {
        ...user,
        fullName: formData.fullName,
        phone: formData.phone,
      };
      localStorage.setItem('dayflow_user', JSON.stringify(updated));
      await refreshUser();
      toast.success('Account settings updated successfully!');
    } catch (err) {
      toast.error('Failed to update account settings.');
    }
  };

  const handleAccountFormError = (errors) => {
    const firstErrKey = Object.keys(errors)[0];
    if (firstErrKey) {
      toast.error(errors[firstErrKey]?.message || 'Please fill in required account fields.');
    }
  };

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveNotifications = () => {
    localStorage.setItem('dayflow_notifications', JSON.stringify(notifications));
    toast.success('Notification preferences saved!');
  };

  const handleSecuritySubmit = async () => {
    try {
      securityForm.reset();
      toast.success('Security password updated successfully!');
    } catch (err) {
      toast.error('Failed to update security password.');
    }
  };

  const handleSecurityFormError = (errors) => {
    const firstErrKey = Object.keys(errors)[0];
    if (firstErrKey) {
      toast.error(errors[firstErrKey]?.message || 'Please check security password fields.');
    }
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === 'theme') {
        localStorage.setItem('dayflow_theme', value);
      }
      return updated;
    });
  };

  const handleSavePreferences = () => {
    localStorage.setItem('dayflow_preferences', JSON.stringify(preferences));
    toast.success('System preferences saved successfully!');
  };

  const tabsConfig = [
    { id: 'account', label: 'Account Settings', icon: <User className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Security & Password', icon: <Lock className="w-4 h-4" /> },
    { id: 'preferences', label: 'System Preferences', icon: <Sliders className="w-4 h-4" /> },
  ];

  return (
    <PageContainer
      title="Settings"
      description="Manage your account settings, notification preferences, security parameters, and application appearance."
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <Card className="p-4">
          <Tabs
            tabs={tabsConfig}
            activeTab={activeTab}
            onChange={(tabId) => setActiveTab(tabId)}
          />
        </Card>

        {/* Tab 1: Account Settings */}
        {activeTab === 'account' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-600" /> General Account Settings
              </CardTitle>
              <CardDescription>Update your personal identity details and contact preferences</CardDescription>
            </CardHeader>
            <form onSubmit={accountForm.handleSubmit(handleAccountSubmit, handleAccountFormError)}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    error={accountForm.formState.errors.fullName?.message}
                    {...accountForm.register('fullName', { required: 'Full name is required' })}
                  />

                  <Input
                    label="Email Address (Read Only)"
                    type="email"
                    disabled
                    {...accountForm.register('email')}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    placeholder="+1 (555) 234-5678"
                    error={accountForm.formState.errors.phone?.message}
                    {...accountForm.register('phone', { required: 'Phone number is required' })}
                  />

                  <Select
                    label="Preferred Language"
                    placeholder=""
                    options={[
                      { label: 'English (US)', value: 'en-US' },
                      { label: 'Spanish (ES)', value: 'es-ES' },
                      { label: 'French (FR)', value: 'fr-FR' },
                      { label: 'German (DE)', value: 'de-DE' },
                    ]}
                    {...accountForm.register('language')}
                  />
                </div>

                <Select
                  label="Timezone"
                  placeholder=""
                  options={[
                    { label: 'Pacific Time (US & Canada) (GMT-08:00)', value: 'America/Los_Angeles' },
                    { label: 'Eastern Time (US & Canada) (GMT-05:00)', value: 'America/New_York' },
                    { label: 'UTC Universal Time', value: 'UTC' },
                    { label: 'India Standard Time (GMT+05:30)', value: 'Asia/Kolkata' },
                  ]}
                  {...accountForm.register('timezone')}
                />
              </CardContent>

              <CardFooter className="justify-end gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={accountForm.formState.isSubmitting}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Save Account Changes
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {/* Tab 2: Notifications */}
        {activeTab === 'notifications' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-600" /> Notification Preferences
              </CardTitle>
              <CardDescription>Choose how and when you receive automated HR system alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                onClick={() => handleNotificationToggle('emailAlerts')}
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 cursor-pointer transition-colors"
              >
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">Email Notifications</h4>
                  <p className="text-[11px] text-slate-500">Receive important updates and leave approvals directly via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailAlerts}
                  onChange={() => {}}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 pointer-events-none"
                />
              </div>

              <div
                onClick={() => handleNotificationToggle('attendanceReminders')}
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 cursor-pointer transition-colors"
              >
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">Daily Attendance Reminders</h4>
                  <p className="text-[11px] text-slate-500">Get notified if you forget to check in or check out</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.attendanceReminders}
                  onChange={() => {}}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 pointer-events-none"
                />
              </div>

              <div
                onClick={() => handleNotificationToggle('leaveUpdates')}
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 cursor-pointer transition-colors"
              >
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">Leave Request Status Updates</h4>
                  <p className="text-[11px] text-slate-500">Instant notification when a manager approves or rejects a request</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.leaveUpdates}
                  onChange={() => {}}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 pointer-events-none"
                />
              </div>

              <div
                onClick={() => handleNotificationToggle('payrollDigest')}
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 cursor-pointer transition-colors"
              >
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">Monthly Payroll Digest</h4>
                  <p className="text-[11px] text-slate-500">Alerts when monthly salary payslips are generated</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.payrollDigest}
                  onChange={() => {}}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 pointer-events-none"
                />
              </div>
            </CardContent>

            <CardFooter className="justify-end gap-3">
              <Button
                type="button"
                onClick={handleSaveNotifications}
                variant="primary"
                size="md"
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Tab 3: Security & Password */}
        {activeTab === 'security' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-600" /> Security & Password
              </CardTitle>
              <CardDescription>Update your account password and security authentication parameters</CardDescription>
            </CardHeader>
            <form onSubmit={securityForm.handleSubmit(handleSecuritySubmit, handleSecurityFormError)}>
              <CardContent className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="••••••••"
                  error={securityForm.formState.errors.currentPassword?.message}
                  {...securityForm.register('currentPassword', { required: 'Current password is required' })}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="New Password"
                    type="password"
                    placeholder="••••••••"
                    error={securityForm.formState.errors.newPassword?.message}
                    {...securityForm.register('newPassword', {
                      required: 'New password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    })}
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="••••••••"
                    error={securityForm.formState.errors.confirmPassword?.message}
                    {...securityForm.register('confirmPassword', {
                      required: 'Please confirm new password',
                      validate: (val) => val === securityForm.watch('newPassword') || 'Passwords do not match',
                    })}
                  />
                </div>

                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center gap-2 text-xs text-indigo-800">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Passwords must be at least 6 characters long with letters and numbers.</span>
                </div>
              </CardContent>

              <CardFooter className="justify-end gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={securityForm.formState.isSubmitting}
                  leftIcon={<KeyRound className="w-4 h-4" />}
                >
                  Update Password
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {/* Tab 4: System Preferences */}
        {activeTab === 'preferences' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" /> Application System Preferences
              </CardTitle>
              <CardDescription>Customize appearance themes and layout defaults</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                  Theme Appearance Mode
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handlePreferenceChange('theme', 'light')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                      preferences.theme === 'light'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Sun className="w-5 h-5 text-amber-500" />
                    <span>Light Mode</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePreferenceChange('theme', 'dark')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                      preferences.theme === 'dark'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Moon className="w-5 h-5 text-indigo-600" />
                    <span>Dark Mode (Beta)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePreferenceChange('theme', 'system')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                      preferences.theme === 'system'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Globe className="w-5 h-5 text-slate-500" />
                    <span>System Sync</span>
                  </button>
                </div>
              </div>

              <Select
                label="Default Landing Page"
                placeholder=""
                value={preferences.defaultLanding}
                onChange={(e) => handlePreferenceChange('defaultLanding', e.target.value)}
                options={
                  role === 'admin'
                    ? [
                        { label: 'Admin Dashboard', value: '/admin/dashboard' },
                        { label: 'Employee Directory', value: '/admin/employees' },
                        { label: 'Attendance Overview', value: '/admin/attendance' },
                      ]
                    : [
                        { label: 'Employee Dashboard', value: '/employee/dashboard' },
                        { label: 'My Profile', value: '/employee/profile' },
                        { label: 'Attendance Log', value: '/employee/attendance' },
                      ]
                }
              />
            </CardContent>

            <CardFooter className="justify-end gap-3">
              <Button
                type="button"
                onClick={handleSavePreferences}
                variant="primary"
                size="md"
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};
