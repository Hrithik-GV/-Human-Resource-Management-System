import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Building, ArrowRight } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';

export const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = (data) => {
    localStorage.setItem('dayflow_token', 'phase1_demo_token');
    navigate(data.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Create an Account
        </h2>
        <p className="text-xs text-slate-500">
          Get started with Dayflow HR management system
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          leftIcon={<User className="w-4 h-4" />}
          placeholder="John Doe"
          error={errors.fullName?.message}
          {...register('fullName', { required: 'Full name is required' })}
        />

        <Input
          label="Work Email"
          type="email"
          leftIcon={<Mail className="w-4 h-4" />}
          placeholder="name@company.com"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />

        <Select
          label="Account Role"
          options={[
            { label: 'Employee', value: 'employee' },
            { label: 'HR Administrator', value: 'admin' },
          ]}
          error={errors.role?.message}
          {...register('role', { required: 'Select a role' })}
        />

        <Input
          label="Password"
          type="password"
          leftIcon={<Lock className="w-4 h-4" />}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isSubmitting}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Create Account
        </Button>
      </form>

      <div className="border-t border-slate-100 pt-5 text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};
