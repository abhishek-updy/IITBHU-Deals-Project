import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout.jsx";
import Button from "../components/Button.jsx";
import { resetPassword } from "../services/authService.js";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, form.password);
      setDone(true);
      toast.success("Password reset successfully!");
    } catch (error) {
      toast.error(error.message || "Reset link is invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-[#02120c] border border-[#047857]/50 rounded-xl px-4 py-3 text-white placeholder-emerald-600/70 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all";
  const labelClass = "block text-sm font-semibold text-emerald-100/80 mb-1.5";

  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[75vh] px-4 py-12">
        <div className="max-w-md w-full bg-[#022c22]/60 p-8 rounded-3xl border border-[#047857]/40 backdrop-blur-sm shadow-2xl">

          {!done ? (
            <>
              {/* Lock icon */}
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-900/50 border border-emerald-700 mx-auto mb-6">
                <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-2xl font-extrabold text-white mb-2">Set a new password</h1>
                <p className="text-sm text-emerald-200/70">
                  Choose a strong new password for your IITBHU Deals account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className={labelClass} htmlFor="password">New Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    className={inputClass}
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    minLength={6}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    className={inputClass}
                    placeholder="Re-enter new password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    minLength={6}
                    required
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="primary" block loading={loading}>
                    Reset Password
                  </Button>
                </div>
              </form>
            </>
          ) : (
            /* Success state */
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-900/50 border border-emerald-500 mx-auto mb-6">
                <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Password Reset!</h2>
              <p className="text-sm text-emerald-200/70 mb-6">
                Your password has been updated successfully. You can now log in with your new password.
              </p>
              <Button variant="primary" block onClick={() => navigate("/login")}>
                Go to Login
              </Button>
            </div>
          )}

          <div className="mt-8 text-center text-sm text-emerald-200/60 pt-6 border-t border-[#047857]/30">
            <Link to="/login" className="text-[#10b981] hover:text-emerald-400 font-bold transition-colors">
              Back to Login
            </Link>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default ResetPassword;
