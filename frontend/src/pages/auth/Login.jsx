import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, UserCheck, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: 'employee@dayflow.com',
      password: 'password123',
    },
  });

  const onSubmit = async (data) => {
    try {
      const user = await login(data.email, data.password);
      toast.success(`Welcome back, ${user.fullName}!`);
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleQuickFill = (role) => {
    if (role === 'admin') {
      setValue('email', 'admin@dayflow.com', { shouldValidate: true });
      setValue('password', 'password123', { shouldValidate: true });
    } else {
      setValue('email', 'employee@dayflow.com', { shouldValidate: true });
      setValue('password', 'password123', { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Sign In
        </h2>
        <p className="text-xs text-slate-500">
          Enter your credentials to access your Dayflow account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Email Address"
          type="email"
          leftIcon={<Mail className="w-4 h-4" />}
          placeholder="name@company.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email address is required',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Please enter a valid email address',
            },
          })}
        />

        <Input
          label="Password"
          type="password"
          leftIcon={<Lock className="w-4 h-4" />}
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
          Login
        </Button>
      </form>

      <div className="border-t border-slate-100 pt-5 text-center text-xs text-slate-500">
        Don't have an account?{' '}
        <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
          Register
        </Link>
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
