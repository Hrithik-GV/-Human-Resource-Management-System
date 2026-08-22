import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-6 shadow-xs">
        <FileQuestion className="w-8 h-8" />
      </div>

      <h1 className="text-4xl font-extrabold text-slate-900 mb-2">404</h1>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-500 max-w-sm mb-8">
        The page you are looking for does not exist or has been relocated within Dayflow.
      </p>

      <Button
        variant="primary"
        size="md"
        leftIcon={<ArrowLeft className="w-4 h-4" />}
        onClick={() => navigate('/employee/dashboard')}
      >
        Return to Dashboard
      </Button>
    </div>
  );
};
