import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout.jsx";
import Button from "../components/Button.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { YEARS } from "../utils/constants.js";

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  department: "",
  year: "",
  password: "",
  confirmPassword: "",
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await register(form);
      navigate("/browse");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Reusable Tailwind classes for clean code
  const inputClasses = "w-full bg-[#02120c] border border-emerald-900/60 rounded-lg px-4 py-2.5 text-emerald-100 placeholder-emerald-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors";
  const labelClasses = "block text-sm font-medium text-emerald-300 mb-1.5";

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-[520px] bg-emerald-950/20 p-8 rounded-2xl border border-emerald-900/50 shadow-xl backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-emerald-400 mb-2">Create your account</h1>
          <p className="text-emerald-200/70 mb-8">Join IITBHU Deals with your college email — it only takes a minute.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelClasses} htmlFor="name">Full Name</label>
              <input id="name" name="name" autoComplete="name" className={inputClasses} placeholder="Aditi Sharma" value={form.name} onChange={handleChange} required />
            </div>

            <div>
              <label className={labelClasses} htmlFor="email">College Email</label>
              <input id="email" name="email" type="email" autoComplete="email" className={inputClasses} placeholder="you@college.edu" value={form.email} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClasses} htmlFor="phone">Phone Number</label>
                <input id="phone" name="phone" autoComplete="tel" className={inputClasses} placeholder="9876543210" value={form.phone} onChange={handleChange} required />
              </div>
              <div>
                <label className={labelClasses} htmlFor="department">Department</label>
                <input id="department" name="department" autoComplete="organization-title" className={inputClasses} placeholder="Computer Science" value={form.department} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <label className={labelClasses} htmlFor="year">Year</label>
              <select id="year" name="year" className={inputClasses} value={form.year} onChange={handleChange} required>
                <option value="" disabled>Select your year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClasses} htmlFor="password">Password</label>
                <input id="password" name="password" type="password" autoComplete="new-password" className={inputClasses} placeholder="At least 6 characters" value={form.password} onChange={handleChange} minLength={6} required />
              </div>
              <div>
                <label className={labelClasses} htmlFor="confirmPassword">Confirm Password</label>
                <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" className={inputClasses} placeholder="Re-enter password" value={form.confirmPassword} onChange={handleChange} minLength={6} required />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" block loading={loading}>
                Create Account
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-emerald-400/70">
            Already have an account? <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium underline-offset-4 hover:underline ml-1">Log in</Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Register;