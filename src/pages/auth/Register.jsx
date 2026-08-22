import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { PATHS } from "../../constants/paths";
import { Input } from "../../components/UI/Input";
import { Select } from "../../components/UI/Select";
import { Button } from "../../components/UI/Button";
import { Sparkles, ArrowRight } from "lucide-react";

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [errors, setErrors] = useState({});

  const handleValidation = () => {
    const tempErrors = {};
    if (!employeeId) tempErrors.employeeId = "Employee ID is required (e.g. EMP-101)";
    if (!name) tempErrors.name = "Full name is required";

    if (!email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = "Invalid email address";

    if (!password) tempErrors.password = "Password is required";
    else if (password.length < 4) tempErrors.password = "Password must be at least 4 characters";

    if (password !== confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    if (!role) tempErrors.role = "Please select a role";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidation()) return;

    const success = await register(employeeId, name, email, password, role);
    if (success) {
      navigate(PATHS.LOGIN);
    }
  };

  const roleOptions = [
    { value: "employee", label: "Employee" },
    { value: "admin", label: "Admin" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left split pane - Branding & taglines */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-950 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-800/10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -ml-16 -mb-16" />

        <div className="flex items-center gap-2.5 z-10">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-premium">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight">DAYFLOW</span>
        </div>

        <div className="z-10 max-w-md">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            Empower your team. Organize your work.
          </h1>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed">
            Create an account to join your company organization. Maintain records of your attendance, track leaves and salaries in real-time.
          </p>
        </div>

        <div className="z-10">
          <p className="text-xs text-slate-500 font-medium">
            © 2026 Dayflow Technologies. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right split pane - Register Form */}
      <div className="w-full lg:w-1/2 bg-slate-50 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md bg-white border border-slate-100 shadow-premium p-8 rounded-2xl">
          <div className="text-center lg:text-left mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Create account</h2>
            <p className="text-xs text-slate-400 mt-1">Fill in the fields below to register with Dayflow</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3.5">
              <Input
                label="Employee ID"
                id="employeeId"
                placeholder="EMP-011"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                error={errors.employeeId}
                required
              />
              <Select
                label="Account Role"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                options={roleOptions}
                error={errors.role}
                required
              />
            </div>

            <Input
              label="Full Name"
              id="name"
              placeholder="Aarav Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              required
            />

            <Input
              label="Email Address"
              id="email"
              type="email"
              placeholder="example@dayflow.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
            />

            <div className="grid grid-cols-2 gap-3.5">
              <Input
                label="Password"
                id="password"
                type="password"
                placeholder="••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                required
              />
              <Input
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                placeholder="••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                required
              />
            </div>

            <Button type="submit" className="w-full justify-center gap-2 mt-4">
              Register <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="text-center mt-5 text-xs text-slate-500">
            Already have an account?{" "}
            <Link to={PATHS.LOGIN} className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
