import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout.jsx";
import Button from "../components/Button.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { getMyProducts } from "../services/productService.js";
import { YEARS } from "../utils/constants.js";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    department: user?.department || "",
    year: user?.year || "",
  });
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ postedCount: 0, soldCount: 0 });

  useEffect(() => {
    getMyProducts()
      .then((res) => setStats(res.stats))
      .catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const inputClass = "w-full bg-[#02120c] border border-[#047857]/50 rounded-xl px-4 py-3 text-white placeholder-emerald-600/70 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all";
  const labelClass = "block text-sm font-semibold text-emerald-100/80 mb-1.5";

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-wide">My Profile</h1>
          <p className="text-emerald-200/70 text-sm md:text-base">
            Manage your account details and see your IITBHU Deals activity.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column: Profile Card */}
          <div className="w-full lg:w-1/3 bg-[#022c22]/60 border border-[#047857]/40 rounded-3xl p-8 flex flex-col items-center text-center backdrop-blur-sm shadow-xl sticky top-24">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#10b981] to-[#047857] text-white flex items-center justify-center text-4xl font-black shadow-[0_0_20px_rgba(16,185,129,0.4)] mb-5">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="text-2xl font-bold text-white mb-1">{user.name}</div>
            <div className="text-emerald-400 font-medium text-sm mb-8">
              {user.department} <span className="text-[#047857] mx-1">•</span> {user.year}
            </div>
            
            <div className="flex w-full border-y border-[#047857]/40 py-5 mb-8">
              <div className="flex-1 border-r border-[#047857]/40">
                <div className="text-3xl font-black text-[#10b981] mb-1">{stats.postedCount}</div>
                <div className="text-[10px] uppercase tracking-widest text-emerald-200/60 font-bold">Posted</div>
              </div>
              <div className="flex-1">
                <div className="text-3xl font-black text-[#10b981] mb-1">{stats.soldCount}</div>
                <div className="text-[10px] uppercase tracking-widest text-emerald-200/60 font-bold">Sold</div>
              </div>
            </div>
            
            <div className="text-sm font-medium text-emerald-300/50 bg-[#02120c] px-4 py-2 rounded-lg border border-[#047857]/30 w-full truncate">
              {user.email}
            </div>
          </div>

          {/* Right Column: Edit Profile Form */}
          <div className="w-full lg:w-2/3 bg-[#022c22]/40 border border-[#047857]/30 rounded-3xl p-6 md:p-10 backdrop-blur-sm shadow-lg">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-[#047857]/40 pb-4">
              Edit Profile Details
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass} htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    className={inputClass}
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    className={inputClass}
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass} htmlFor="department">Department</label>
                  <input
                    id="department"
                    name="department"
                    className={inputClass}
                    value={form.department}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="year">Year</label>
                  <select 
                    id="year" 
                    name="year" 
                    className={`${inputClass} cursor-pointer`} 
                    value={form.year} 
                    onChange={handleChange} 
                    required
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y} className="bg-[#02120c]">{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>College Email</label>
                <input 
                  className={`${inputClass} opacity-60 cursor-not-allowed`} 
                  value={user.email} 
                  disabled 
                />
                <span className="block mt-2 text-xs font-medium text-emerald-500/70">
                  Your college email cannot be changed as it verifies your campus identity.
                </span>
              </div>

              <div className="pt-6 mt-8 border-t border-[#047857]/30 flex justify-end">
                <Button type="submit" variant="primary" loading={saving} className="w-full md:w-auto px-10">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;