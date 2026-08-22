import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, UserCheck, Shield } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      email: 'employee@dayflow.com',
      password: 'password123',
    }
  });

  const onSubmit = (data) => {
    // Phase 1 placeholder login behavior
    localStorage.setItem('dayflow_token', 'phase1_demo_token');
    navigate('/employee/dashboard');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="text-xs text-slate-500">
          Sign in to access your Dayflow portal
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          leftIcon={<Mail className="w-4 h-4" />}
          placeholder="name@company.com"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />

        <Input
          label="Password"
          type="password"
          leftIcon={<Lock className="w-4 h-4" />}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', { required: 'Password is required' })}
        />

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-slate-600">
            <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
            <span>Remember me</span>
          </label>
          <span className="text-indigo-600 hover:underline cursor-pointer font-medium">
            Forgot password?
          </span>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isSubmitting}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Sign In
        </Button>
      </form>

      <div className="border-t border-slate-100 pt-5 text-center text-xs text-slate-500">
        Don't have an account?{' '}
        <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
          Register here
        </Link>
      </div>

      {/* Quick Phase 1 Role Portals Selector */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
          Phase 1 Quick Access Demo:
        </span>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<UserCheck className="w-3.5 h-3.5 text-indigo-600" />}
            onClick={() => navigate('/employee/dashboard')}
          >
            Employee Portal
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Shield className="w-3.5 h-3.5 text-indigo-600" />}
            onClick={() => navigate('/admin/dashboard')}
          >
            Admin Portal
          </Button>
        </div>
      </div>
    </div>
  );
};
