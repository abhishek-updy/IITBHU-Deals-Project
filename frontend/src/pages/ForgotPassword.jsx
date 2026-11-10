import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout.jsx";
import Button from "../components/Button.jsx";
import { forgotPassword } from "../services/authService.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
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

          {!sent ? (
            <>
              {/* Lock icon */}
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-900/50 border border-emerald-700 mx-auto mb-6">
                <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-2xl font-extrabold text-white mb-2">Forgot your password?</h1>
                <p className="text-sm text-emerald-200/70">
                  Enter your college email and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className={labelClass} htmlFor="email">College Email</label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={inputClass}
                    placeholder="you@iitbhu.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" variant="primary" block loading={loading}>
                  Send Reset Link
                </Button>
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
              <h2 className="text-xl font-bold text-white mb-3">Check your email!</h2>
              <p className="text-sm text-emerald-200/70 mb-2">
                If <span className="text-emerald-400 font-semibold">{email}</span> is registered and verified,
                a password reset link has been sent to it.
              </p>
              <p className="text-xs text-emerald-200/50 mb-6">The link expires in 1 hour.</p>
              <button
                onClick={() => { setSent(false); setEmail(""); }}
                className="text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                Try a different email
              </button>
            </div>
          )}

          <div className="mt-8 text-center text-sm text-emerald-200/60 pt-6 border-t border-[#047857]/30">
            Remember your password?{" "}
            <Link to="/login" className="text-[#10b981] hover:text-emerald-400 font-bold transition-colors ml-1">
              Log in
            </Link>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default ForgotPassword;
