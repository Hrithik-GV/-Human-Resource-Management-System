import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { PATHS } from "../../constants/paths";
import { Input } from "../../components/UI/Input";
import { Button } from "../../components/UI/Button";
import { Sparkles, ArrowRight, ShieldCheck, User } from "lucide-react";

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleValidation = () => {
    const tempErrors = {};
    if (!email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = "Invalid email address";

    if (!password) tempErrors.password = "Password is required";
    else if (password.length < 4) tempErrors.password = "Password must be at least 4 characters";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidation()) return;

    const user = await login(email, password);
    if (user) {
      if (user.role === "admin") {
        navigate(PATHS.ADMIN_DASHBOARD);
      } else {
        navigate(PATHS.EMPLOYEE_DASHBOARD);
      }
    }
  };

  // Helper for quick testing
  const handleDemoLogin = async (role) => {
    if (role === "admin") {
      setEmail("neha.patel@dayflow.com");
      setPassword("admin123");
      const user = await login("neha.patel@dayflow.com", "admin123");
      if (user) navigate(PATHS.ADMIN_DASHBOARD);
    } else {
      setEmail("aarav.sharma@dayflow.com");
      setPassword("pass123");
      const user = await login("aarav.sharma@dayflow.com", "pass123");
      if (user) navigate(PATHS.EMPLOYEE_DASHBOARD);
    }
  };

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
            Streamline your workforce, elevate your productivity.
          </h1>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed">
            The next-generation HR management suite engineered to build cohesive, high-performing teams, optimize attendance trackers, automate leave logs and process payroll effortlessly.
          </p>
        </div>

        <div className="z-10">
          <p className="text-xs text-slate-500 font-medium">
            © 2026 Dayflow Technologies. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right split pane - Login Form */}
      <div className="w-full lg:w-1/2 bg-slate-50 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md bg-white border border-slate-100 shadow-premium p-8 rounded-2xl">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Sign in to Dayflow</h2>
            <p className="text-xs text-slate-400 mt-1.5">Enter your credentials below to access your portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Work Email"
              id="email"
              type="email"
              placeholder="example@dayflow.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              required
            />

            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-brand-600 border-slate-200 rounded focus:ring-brand-500 cursor-pointer"
                />
                Remember me
              </label>
              <a href="#forgot" className="text-brand-600 hover:text-brand-700 transition-colors">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full justify-center gap-2 mt-2">
              Sign In <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Quick Demo Login Selector */}
          <div className="mt-8 border-t border-slate-100 pt-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
              Hackathon Quick Access (Demo Logins)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleDemoLogin("admin")}
                className="flex items-center gap-2 justify-center py-2 border border-slate-200 hover:bg-slate-50"
              >
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                Demo Admin
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleDemoLogin("employee")}
                className="flex items-center gap-2 justify-center py-2 border border-slate-200 hover:bg-slate-50"
              >
                <User className="w-4 h-4 text-slate-500" />
                Demo Employee
              </Button>
            </div>
          </div>

          <div className="text-center mt-6 text-xs text-slate-500">
            Don't have an account?{" "}
            <Link to={PATHS.REGISTER} className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
