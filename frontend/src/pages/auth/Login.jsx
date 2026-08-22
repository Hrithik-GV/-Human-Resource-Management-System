import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, UserCheck, Shield, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      identifier: 'employee@dayflow.com',
      password: 'password123',
    },
  });

  const onSubmit = async (data) => {
    try {
      const user = await login(data.identifier, data.password);
      
      // First login check: redirect to change-password if temp password was used
      if (user.mustChangePassword) {
        toast.error('First login detected! Please set a new password to proceed.', { icon: '🔐' });
        navigate('/change-password');
        return;
      }

      toast.success(`Welcome back, ${user.fullName}!`);
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleQuickFill = (role) => {
    if (role === 'admin') {
      setValue('identifier', 'admin@dayflow.com', { shouldValidate: true });
      setValue('password', 'password123', { shouldValidate: true });
    } else {
      setValue('identifier', 'employee@dayflow.com', { shouldValidate: true });
      setValue('password', 'password123', { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Logo Banner */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">DAYFLOW HRMS</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Sign In
        </h2>
        <p className="text-xs text-slate-500">
          Enter your Login ID or Email and password to access your workspace
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Login ID or Email"
          type="text"
          leftIcon={<User className="w-4 h-4" />}
          placeholder="OITODO20230001 or name@company.com"
          error={errors.identifier?.message}
          {...register('identifier', {
            required: 'Login ID or Email is required',
            minLength: {
              value: 3,
              message: 'Please enter a valid Login ID or Email',
            },
          })}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
        />

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-slate-600">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Remember me</span>
          </label>
          <span className="text-indigo-600 hover:underline cursor-pointer font-medium">
            Forgot Password?
          </span>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isSubmitting}
          isDisabled={!isValid || isSubmitting}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Sign In
        </Button>
      </form>

      {/* Note for Employee Registration (Admin / HR controlled) */}
      <div className="border-t border-slate-100 pt-5 text-center text-xs text-slate-500 space-y-1">
        <p>
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
            Contact HR / Create Employee
          </Link>
        </p>
        <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
          <AlertCircle className="w-3 h-3 text-amber-500" />
          Employee accounts are created directly by HR/Admin.
        </p>
      </div>

      {/* Demo Credentials Quick Switcher */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
          Demo Quick Credentials:
        </span>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<UserCheck className="w-3.5 h-3.5 text-indigo-600" />}
            onClick={() => handleQuickFill('employee')}
          >
            Employee
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Shield className="w-3.5 h-3.5 text-indigo-600" />}
            onClick={() => handleQuickFill('admin')}
          >
            Admin
          </Button>
        </div>
      </div>
    </div>
  );
};
