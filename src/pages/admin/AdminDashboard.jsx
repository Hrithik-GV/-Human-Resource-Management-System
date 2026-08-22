import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, FileCheck, CreditCard, Shield, ArrowRight } from 'lucide-react';
import { PageContainer } from '../../components/common/PageContainer';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const quickLinks = [
    { label: 'Employee Directory', description: 'Manage workforce & staff records', path: '/admin/employees', icon: Users, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Attendance Logs', description: 'Monitor daily attendance logs', path: '/admin/attendance', icon: Clock, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Leave Approvals', description: 'Review & approve leave requests', path: '/admin/leaves', icon: FileCheck, color: 'bg-amber-50 text-amber-600' },
    { label: 'Payroll Admin', description: 'Process salary payouts & slips', path: '/admin/payroll', icon: CreditCard, color: 'bg-sky-50 text-sky-600' },
  ];

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-none shadow-md overflow-hidden relative">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
          <CardContent className="p-8 relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm" className="bg-indigo-500/30 text-indigo-200 border-indigo-400/30">
                <Shield className="w-3.5 h-3.5 mr-1" /> Admin Command Center
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {currentUser?.fullName || 'Administrator'}!
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Overview of system operations and administrative controls. Select any quick link below to manage workforce records or approve pending requests.
            </p>
          </CardContent>
        </Card>

        {/* Quick Links Section */}
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-4">Management Modules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.path}
                  className="hover:border-indigo-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
                  onClick={() => navigate(item.path)}
                >
                  <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {item.label}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
