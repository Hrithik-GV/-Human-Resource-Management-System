import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, ShieldCheck, ArrowRight, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export const ChangePassword = () => {
  const navigate = useNavigate();
  const { changePassword, currentUser } = useAuth();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: 'onChange',
  });

  const newPassword = watch('newPassword');

  const onSubmit = async (data) => {
    try {
      const updatedUser = await changePassword(data.currentPassword, data.newPassword);
      toast.success('Password updated successfully! Welcome to your Dayflow workspace.');
      navigate(updatedUser.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard');
    } catch (err) {
      toast.error(err.message || 'Failed to update password. Please verify current password.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
          <KeyRound className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Change Temporary Password
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          This is your first login. For safety and compliance, please replace your temporary password with a permanent one before accessing your dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Current Temporary Password"
          type={showCurrent ? 'text' : 'password'}
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          placeholder="Enter temporary password"
          error={errors.currentPassword?.message}
          {...register('currentPassword', {
            required: 'Current password is required',
          })}
        />

        <Input
          label="New Password"
          type={showNew ? 'text' : 'password'}
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          placeholder="Min 6 characters"
          error={errors.newPassword?.message}
          {...register('newPassword', {
            required: 'New password is required',
            minLength: {
              value: 6,
              message: 'New password must be at least 6 characters',
            },
          })}
        />

        <Input
          label="Confirm New Password"
          type={showConfirm ? 'text' : 'password'}
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          placeholder="Re-enter new password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your new password',
            validate: (val) => val === newPassword || 'Passwords do not match',
          })}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isSubmitting}
          isDisabled={!isValid || isSubmitting}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Update Password & Proceed
        </Button>
      </form>
    </div>
  );
};
