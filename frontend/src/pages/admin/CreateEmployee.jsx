import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Building,
  Sparkles,
  Copy,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  PlusCircle,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PageContainer } from '../../components/common/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { CompanyLogoUpload } from '../../components/ui/CompanyLogoUpload';
import { generateLoginId } from '../../utils/loginIdGenerator';
import { generateTempPassword } from '../../utils/passwordGenerator';
import { adminService } from '../../services/adminService';

export const CreateEmployee = () => {
  const navigate = useNavigate();
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      companyName: 'Dayflow Inc.',
      companyLogo: '',
      fullName: '',
      email: '',
      phone: '',
      joiningYear: new Date().getFullYear(),
    },
  });

  const fullName = watch('fullName');
  const joiningYear = watch('joiningYear');

  // Compute live auto-generated Login ID preview
  const liveLoginId = generateLoginId(fullName || '', joiningYear || new Date().getFullYear(), 1);

  const onSubmit = async (data) => {
    try {
      // System automatically generates Login ID and initial password
      const response = await adminService.createEmployee({
        companyName: data.companyName,
        companyLogo: data.companyLogo,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        joiningYear: data.joiningYear,
      });

      const tempPass = response.temporaryPassword || generateTempPassword();
      const loginId = response.loginId || liveLoginId;

      setCreatedCredentials({
        employeeName: data.fullName,
        companyName: data.companyName,
        loginId,
        temporaryPassword: tempPass,
        email: data.email,
      });

      toast.success(`Employee ${data.fullName} registered successfully!`);
    } catch (err) {
      toast.error(err.message || 'Failed to create employee. Please check inputs.');
    }
  };

  const handleCopyCredentials = () => {
    if (!createdCredentials) return;
    const textToCopy = `Dayflow Employee Credentials:\nLogin ID: ${createdCredentials.loginId}\nTemporary Password: ${createdCredentials.temporaryPassword}\nEmail: ${createdCredentials.email}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success('Login ID and Password copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleResetForm = () => {
    setCreatedCredentials(null);
    reset({
      companyName: 'Dayflow Inc.',
      companyLogo: '',
      fullName: '',
      email: '',
      phone: '',
      joiningYear: new Date().getFullYear(),
    });
  };

  return (
    <PageContainer
      title="Create Employee"
      description="Register a new employee into your organization with auto-generated system credentials."
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {createdCredentials ? (
          /* Post-Creation Success Card with Login ID & Temporary Password */
          <Card className="border-emerald-200 bg-emerald-50/20 shadow-md">
            <CardHeader className="text-center pb-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">
                Employee Created Successfully 🎉
              </CardTitle>
              <CardDescription>
                System credentials have been automatically generated for <strong>{createdCredentials.employeeName}</strong>.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
              <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-medium text-slate-500">Company</span>
                  <span className="text-xs font-bold text-slate-900">{createdCredentials.companyName}</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Generated Login ID
                  </label>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-base font-bold text-indigo-600 tracking-wider">
                    {createdCredentials.loginId}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Generated Temporary Password
                  </label>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-base font-bold text-slate-800 tracking-wider">
                    {createdCredentials.temporaryPassword}
                  </div>
                </div>

                <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-amber-600" />
                  The employee will be prompted to change this temporary password upon their first login.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto flex-1"
                  onClick={handleCopyCredentials}
                  leftIcon={copied ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                >
                  {copied ? 'Credentials Copied!' : 'Copy Login ID & Password'}
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  className="w-full sm:w-auto"
                  onClick={handleResetForm}
                  leftIcon={<PlusCircle className="w-4 h-4" />}
                >
                  Create Another Employee
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  className="w-full sm:w-auto"
                  onClick={() => navigate('/admin/employees')}
                  leftIcon={<Users className="w-4 h-4" />}
                >
                  View Staff Directory
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Employee Creation Form */
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5 text-indigo-600" />
                Employee Registration & System Credentials
              </CardTitle>
              <CardDescription>
                Provide company and employee details. Login ID and temporary password will be created automatically.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                {/* Company Name */}
                <Input
                  label="Company Name"
                  type="text"
                  leftIcon={<Building className="w-4 h-4" />}
                  placeholder="e.g. Dayflow Technologies"
                  error={errors.companyName?.message}
                  {...register('companyName', {
                    required: 'Company name is required',
                  })}
                />

                {/* Company Logo Upload Component */}
                <Controller
                  name="companyLogo"
                  control={control}
                  render={({ field }) => (
                    <CompanyLogoUpload
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.companyLogo?.message}
                    />
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Employee Name */}
                  <Input
                    label="Employee Name"
                    type="text"
                    leftIcon={<User className="w-4 h-4" />}
                    placeholder="e.g. Oliver Todd"
                    error={errors.fullName?.message}
                    {...register('fullName', {
                      required: 'Employee name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters',
                      },
                    })}
                  />

                  {/* Employee Email */}
                  <Input
                    label="Employee Email"
                    type="email"
                    leftIcon={<Mail className="w-4 h-4" />}
                    placeholder="e.g. oliver.todd@company.com"
                    error={errors.email?.message}
                    {...register('email', {
                      required: 'Employee email is required',
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: 'Please enter a valid email address',
                      },
                    })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone Number */}
                  <Input
                    label="Phone Number"
                    type="tel"
                    leftIcon={<Phone className="w-4 h-4" />}
                    placeholder="e.g. +1 555 123 4567"
                    error={errors.phone?.message}
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^\+?[0-9\s-]{7,15}$/,
                        message: 'Please enter a valid phone number',
                      },
                    })}
                  />

                  {/* Auto-Generated Login ID Read-Only Preview */}
                  <Input
                    label="Auto-Generated Login ID (Preview)"
                    type="text"
                    readOnly
                    disabled
                    value={liveLoginId || 'OITODO20230001'}
                    helperText="Format: First 2 letters of first name + First 2 letters of last name + Year + Sequence"
                    className="font-mono font-bold text-indigo-700 bg-indigo-50/50"
                  />
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    Automatic Credential Generation
                  </p>
                  <p className="text-xs text-slate-500">
                    Login ID and temporary initial password are generated automatically upon creation. The Admin does not need to enter credentials manually.
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    isDisabled={!isValid || isSubmitting}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Create Employee Record
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};
