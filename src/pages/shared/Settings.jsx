import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../hooks/useAuth";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/UI/Card";
import { Button } from "../../components/UI/Button";
import { Input } from "../../components/UI/Input";
import { Badge } from "../../components/UI/Badge";
import { Settings as SettingsIcon, Bell, Lock, User, Shield } from "lucide-react";

export const Settings = () => {
  const { addToast } = useApp();
  const { currentUser } = useAuth();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  if (!currentUser) return null;

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    addToast("Notification preferences updated", "success");
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      addToast("Please fill all password fields", "error");
      return;
    }
    addToast("Password changed successfully (simulated)", "success");
    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Account Settings</h2>
        <p className="text-xs text-slate-400 mt-1">Configure your portal preferences, login credentials and system settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 lg:col-span-2">
          {/* Notifications config */}
          <Card>
            <CardHeader className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <Bell className="w-5 h-5 text-brand-600" />
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleSaveNotifications} className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Email Notifications</h4>
                    <p className="text-xs text-slate-400">Receive alerts when leaves are approved, check-out missed or payroll is credited.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={() => setEmailNotifications(!emailNotifications)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-slate-100">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Weekly Performance Digest</h4>
                    <p className="text-xs text-slate-400">Receive weekly hours statistics and attendance summaries on Mondays.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={weeklyDigest}
                      onChange={() => setWeeklyDigest(!weeklyDigest)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
                  </label>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit">Save Preferences</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Change Password config */}
          <Card>
            <CardHeader className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-brand-600" />
              <CardTitle>Change Security Password</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleSavePassword} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Current Password"
                    id="current-pwd"
                    type="password"
                    placeholder="••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <Input
                    label="New Password"
                    id="new-pwd"
                    type="password"
                    placeholder="••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Update Password</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Info panel */}
        <div>
          <Card className="h-full">
            <CardHeader className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-600" />
              <CardTitle>Security Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 text-xs font-semibold text-slate-500">
              <p className="leading-relaxed">
                Dayflow uses encryption protocols to safeguard your personal credentials. Session management is strictly handled locally in this demonstration environment.
              </p>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-700">
                <p className="font-bold">Client IP Address</p>
                <p className="font-normal text-slate-500 mt-0.5">127.0.0.1 (Local Loopback)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default Settings;
