import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout.jsx";
import Button from "../components/Button.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { resendOTP } from "../services/authService.js";

const VerifyEmail = () => {
  const { verifyAndLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Email passed from Register or Login page via router state
  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputsRef = useRef([]);

  // Handle typing in each OTP box
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    const updated = [...otp];
    updated[index] = value.slice(-1); // Allow only 1 digit per box
    setOtp(updated);
    // Auto-focus next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Allow backspace to go back to previous box
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Allow pasting a full 6-digit OTP
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputsRef.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Please enter all 6 digits");
      return;
    }
    if (!email) {
      toast.error("Email not found. Please register again.");
      navigate("/register");
      return;
    }
    setLoading(true);
    try {
      await verifyAndLogin(email, code);
      navigate("/browse");
    } catch (error) {
      toast.error(error.message || "Invalid OTP. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    try {
      await resendOTP(email);
      toast.success("New OTP sent! Check your email.");
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    } catch (error) {
      toast.error(error.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[75vh] px-4 py-12">
        <div className="max-w-md w-full bg-[#022c22]/60 p-8 rounded-3xl border border-[#047857]/40 backdrop-blur-sm shadow-2xl text-center">

          {/* Icon */}
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-900/50 border border-emerald-700 mx-auto mb-6">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="text-2xl font-extrabold text-white mb-2">Check your email</h1>
          <p className="text-sm text-emerald-200/70 mb-2">
            We sent a 6-digit OTP to
          </p>
          <p className="text-emerald-400 font-semibold mb-6 break-all">{email || "your college email"}</p>

          <form onSubmit={handleSubmit}>
            {/* OTP input boxes */}
            <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-11 h-14 text-center text-xl font-bold bg-[#02120c] border-2 border-emerald-900/60 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all caret-emerald-400"
                />
              ))}
            </div>

            <Button type="submit" variant="primary" block loading={loading}>
              Verify Email
            </Button>
          </form>

          <p className="mt-6 text-sm text-emerald-200/60">
            Didn't receive the code?{" "}
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors disabled:opacity-50 ml-1"
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          </p>

          <p className="mt-3 text-xs text-emerald-200/40">
            The OTP expires in 15 minutes.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default VerifyEmail;
