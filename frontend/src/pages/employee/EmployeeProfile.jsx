import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  IdCard,
  CreditCard,
  FileText,
  Edit3,
  Download,
  Building,
  ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PageContainer } from '../../components/common/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { SkeletonLoader } from '../../components/ui/SkeletonLoader';
import { employeeService } from '../../services/employeeService';
import { payrollService } from '../../services/payrollService';
import { useAuth } from '../../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const resolveAvatar = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE}/${path}`;
};

export const EmployeeProfile = () => {
  const { refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [payroll, setPayroll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const [data, payData] = await Promise.all([
        employeeService.getProfile(),
        payrollService.getSalarySummary(),
      ]);
      setProfile(data);
      setPayroll(payData);
      reset({
        phone: data.phone || '',
        address: data.address || '',
        avatar: data.avatar || '',
      });
    } catch (err) {
      toast.error('Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = () => {
    reset({
      phone: profile?.phone || '',
      address: profile?.address || '',
      avatar: profile?.avatar || '',
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (formData) => {
    try {
      const updated = await employeeService.updateProfile(formData);
      setProfile(updated);
      await refreshUser();
      toast.success('Profile contact details updated successfully!');
      setIsEditModalOpen(false);
    } catch (err) {
      toast.error('Failed to update profile details.');
    }
  };

  const handleEditError = (formErrors) => {
    const firstErrKey = Object.keys(formErrors)[0];
    if (firstErrKey) {
      toast.error(formErrors[firstErrKey]?.message || 'Please fill in required fields.');
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <SkeletonLoader variant="card" className="h-40" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkeletonLoader variant="card" className="h-64" />
            <SkeletonLoader variant="card" className="h-64" />
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="bg-white border border-slate-200 shadow-xs">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <Avatar
                src={resolveAvatar(profile?.avatar)}
                name={profile?.fullName}
                size="xl"
                className="ring-4 ring-indigo-50 shrink-0"
              />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl font-bold text-slate-900">{profile?.fullName}</h1>
                  <Badge variant="primary" size="sm">
                    {profile?.status}
                  </Badge>
                </div>
                <p className="text-sm font-semibold text-indigo-600">{profile?.position}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <IdCard className="w-3.5 h-3.5 text-slate-400" /> {profile?.employeeId}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" /> {profile?.department}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {profile?.workLocation}
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="md"
              leftIcon={<Edit3 className="w-4 h-4 text-indigo-600" />}
              onClick={handleOpenEditModal}
              className="shrink-0"
            >
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-600" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Full Name</span>
                  <span className="font-semibold text-slate-800">{profile?.fullName}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Email Address</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {profile?.email}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Phone Number</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {profile?.phone}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Date of Birth</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> {profile?.dateOfBirth}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-xs text-slate-500 font-medium block">Residential Address</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {profile?.address}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Information */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" /> Job Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Employee ID</span>
                  <span className="font-semibold text-slate-800">{profile?.employeeId}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Department</span>
                  <span className="font-semibold text-slate-800">{profile?.department}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Position / Designation</span>
                  <span className="font-semibold text-slate-800">{profile?.position}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Reporting Manager</span>
                  <span className="font-semibold text-slate-800">{profile?.manager}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Joining Date</span>
                  <span className="font-semibold text-slate-800">{profile?.joiningDate}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Employment Status</span>
                  <Badge variant="success" size="sm" className="mt-1">
                    <ShieldCheck className="w-3 h-3 mr-1" /> {profile?.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Salary Information (Read-only) */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-600" /> Salary Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 block font-medium">Basic Salary</span>
                  <span className="text-base font-extrabold text-slate-900">${(payroll?.basicSalary || 0).toLocaleString()}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 block font-medium">Gross Salary</span>
                  <span className="text-base font-extrabold text-emerald-600">${(payroll?.grossSalary || 0).toLocaleString()}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 block font-medium">Bonus</span>
                  <span className="text-base font-extrabold text-indigo-600">+${(payroll?.bonus || 0).toLocaleString()}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 block font-medium">Net Salary</span>
                  <span className="text-base font-extrabold text-slate-900">${(payroll?.netSalary || 0).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" /> Attached Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {(profile?.documents || []).length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No documents uploaded yet.</p>
                ) : (
                  (profile?.documents || []).map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{doc.name}</p>
                          <p className="text-[10px] text-slate-400">{doc.size} • Uploaded on {doc.date}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Profile Modal (Only Phone, Address, Avatar editable) */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Profile Information"
          description="Update your contact phone number, address, and profile picture avatar URL."
        >
          <form onSubmit={handleSubmit(handleEditSubmit, handleEditError)} className="space-y-4">
            <Input
              label="Phone Number"
              type="text"
              leftIcon={<Phone className="w-4 h-4" />}
              placeholder="+1 (555) 000-0000"
              error={errors.phone?.message}
              {...register('phone', { required: 'Phone number is required' })}
            />

            <Input
              label="Residential Address"
              type="text"
              leftIcon={<MapPin className="w-4 h-4" />}
              placeholder="Street, City, State, ZIP"
              error={errors.address?.message}
              {...register('address', { required: 'Address is required' })}
            />

            <Input
              label="Profile Picture URL"
              type="url"
              placeholder="https://images.unsplash.com/..."
              helperText="Enter a valid image URL for your profile avatar"
              error={errors.avatar?.message}
              {...register('avatar')}
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="outline" size="md" onClick={() => setIsEditModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit" isLoading={isSubmitting}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </PageContainer>
  );
};
