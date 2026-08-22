import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export const Register = () => {
  const navigate = useNavigate();
  const { currentUser, role } = useAuth();

  if (role === 'admin') {
    navigate('/admin/create-employee');
    return null;
  }

  return (
    <div className="space-y-6 text-center sm:text-left">
      <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2 mx-auto sm:mx-0">
        <ShieldAlert className="w-6 h-6" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Admin / HR Registration Only
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Public self-registration is disabled for Dayflow HRMS. Employee accounts are created exclusively by authorized HR Administrators.
        </p>
      </div>

      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-left">
        <p className="text-xs font-semibold text-slate-800">
          Already an Employee?
        </p>
        <p className="text-xs text-slate-500">
          Please log in using your auto-generated Login ID and temporary password provided by your HR Administrator.
        </p>
      </div>

      <div className="space-y-3 pt-2">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => navigate('/login')}
          leftIcon={<LogIn className="w-4 h-4" />}
        >
          Go to Sign In
        </Button>

        <div className="text-center text-xs text-slate-500">
          Admin Access?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            Log in as Admin to Create Employees
          </Link>
        </div>
      </div>
    </div>
  );
};
