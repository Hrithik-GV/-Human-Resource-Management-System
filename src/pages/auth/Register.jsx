import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, IdCard, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export const Register = () => {
  const navigate = useNavigate();
  const { register: registerAuth } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      employeeId: '',
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'employee',
    },
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      const user = await registerAuth(data);
      toast.success('Registration successful! Welcome to Dayflow.');
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Create an Account
        </h2>
        <p className="text-xs text-slate-500">
          Enter your details below to register your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Employee ID"
          type="text"
          leftIcon={<IdCard className="w-4 h-4" />}
          placeholder="EMP-1001"
          error={errors.employeeId?.message}
          {...register('employeeId', {
            required: 'Employee ID is required',
          })}
        />

        <Input
          label="Full Name"
          type="text"
          leftIcon={<User className="w-4 h-4" />}
          placeholder="Jane Doe"
          error={errors.fullName?.message}
          {...register('fullName', {
            required: 'Full name is required',
          })}
        />

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

        <Select
          label="Role"
          options={[
            { label: 'Employee', value: 'employee' },
            { label: 'Admin', value: 'admin' },
          ]}
          error={errors.role?.message}
          {...register('role', {
            required: 'Please select a role',
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

        <Input
          label="Confirm Password"
          type="password"
          leftIcon={<Lock className="w-4 h-4" />}
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) =>
              value === password || 'Passwords do not match',
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
          Register
        </Button>
      </form>

      <div className="border-t border-slate-100 pt-5 text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
};
