import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout.jsx";
import Button from "../components/Button.jsx";
import { useAuth } from "../hooks/useAuth.js";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      navigate(location.state?.from || "/browse");
    } catch (error) {
      if (error.requiresVerification) {
        // Redirect to OTP page so user can verify their email
        navigate("/verify-email", { state: { email: error.email } });
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-[#02120c] border border-[#047857]/50 rounded-xl px-4 py-3 text-white placeholder-emerald-600/70 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all";
  const labelClass = "block text-sm font-semibold text-emerald-100/80 mb-1.5";

  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[75vh] px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-[#022c22]/60 p-8 rounded-3xl border border-[#047857]/40 backdrop-blur-sm shadow-2xl">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2 tracking-wide">Welcome back</h1>
            <p className="text-sm text-emerald-200/70">Log in with your college email to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={labelClass} htmlFor="email">
                College Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={inputClass}
                placeholder="you@iitbhu.ac.in"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={labelClass} htmlFor="password">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className={inputClass}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" block loading={loading}>
                Log In
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm text-emerald-200/60 pt-6 border-t border-[#047857]/30">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#10b981] hover:text-emerald-400 font-bold transition-colors ml-1">
              Register here
            </Link>
          </div>
          
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
