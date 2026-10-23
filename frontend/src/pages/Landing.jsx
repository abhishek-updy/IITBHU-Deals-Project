import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiShield, FiSearch, FiUsers, FiTrendingUp, FiTag } from "react-icons/fi";
import MainLayout from "../layouts/MainLayout.jsx";
import SearchBar from "../components/SearchBar.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Button from "../components/Button.jsx";
import { getProducts } from "../services/productService.js";
import { CATEGORIES } from "../utils/constants.js";

const WHY_PLATFORM = [
  {
    icon: FiShield,
    title: "Verified Campus Only",
    text: "Every listing comes from a fellow IIT BHU student — no strangers, no spam, no scams.",
  },
  {
    icon: FiSearch,
    title: "Actually Searchable",
    text: "Filter by category, price, and condition instead of scrolling a buried WhatsApp thread.",
  },
  {
    icon: FiTag,
    title: "Clear Product Details",
    text: "Photos, condition, price, and seller info — everything you need before you message.",
  },
];

const STEPS = [
  { title: "Create your account", text: "Sign up with your college email in under a minute." },
  { title: "List or browse", text: "Post what you're selling, or search what you need." },
  { title: "Connect with the seller", text: "Reach out directly using their listed contact." },
  { title: "Meet, pay, done", text: "Mark it sold once the handover is complete." },
];

const TESTIMONIALS = [
  { name: "Ananya R.", role: "Final Year, CSE", quote: "Sold my old lab kit and calculator in two days — way faster than the WhatsApp group ever was." },
  { name: "Rohit V.", role: "3rd Year, Mechanical", quote: "Found a cycle for half the showroom price, listed by a senior who was graduating." },
  { name: "Meera S.", role: "2nd Year, ECE", quote: "Finally a place where I can actually filter by price instead of scrolling forever." },
];

const Landing = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [latest, setLatest] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0 });

  useEffect(() => {
    (async () => {
      try {
        const [latestRes, popularRes] = await Promise.all([
          getProducts({ limit: 4, sort: "newest" }),
          getProducts({ limit: 4, sort: "oldest" }),
        ]);
        setLatest(latestRes.data);
        setPopular(popularRes.data);
        setStats({ total: latestRes.pagination?.total || 0 });
      } catch (error) {
        // Landing page should still render even if the API is briefly unavailable.
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSearch = (value) => {
    navigate(`/browse${value ? `?search=${encodeURIComponent(value)}` : ""}`);
  };

  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#02120c] py-16 lg:py-24 border-b border-[#047857]/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#047857]/20 via-[#02120c] to-[#02120c] opacity-70"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12">
          
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block py-1 px-3 rounded-full bg-[#047857]/20 border border-[#047857]/50 text-[#10b981] font-bold tracking-wider uppercase text-xs mb-6 shadow-sm">
              The campus-only marketplace
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Buy. Sell. Save. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-emerald-300">Inside Your Campus.</span>
            </h1>
            <p className="text-lg md:text-xl text-emerald-100/70 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Skip the buried WhatsApp threads. IITBHU Deals is where students list books,
              electronics, cycles, and hostel essentials — organized, searchable, and
              only ever a message away from a fellow student.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Button variant="primary" size="md" onClick={() => navigate("/sell")} className="w-full sm:w-auto px-8 py-3 text-lg">
                Sell a Product
              </Button>
              <Button variant="outline" size="md" onClick={() => navigate("/browse")} className="w-full sm:w-auto px-8 py-3 text-lg">
                Browse Products
              </Button>
            </div>
            <div className="max-w-xl mx-auto lg:mx-0">
              <SearchBar value={search} onChange={setSearch} onSubmit={handleSearch} variant="hero" />
            </div>
          </div>

          <div className="hidden lg:flex flex-1 justify-center relative">
            <div className="relative w-80 bg-[#022c22]/80 backdrop-blur-xl border border-[#047857]/50 rounded-2xl p-6 shadow-[0_20px_50px_rgba(4,120,87,0.3)] transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#047857]/40 pb-3">
                  <span className="text-emerald-500/80 text-xs font-bold uppercase tracking-wider">Category</span>
                  <span className="text-white font-medium">Electronics</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#047857]/40 pb-3">
                  <span className="text-emerald-500/80 text-xs font-bold uppercase tracking-wider">Condition</span>
                  <span className="text-[#10b981] font-medium">Like New</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#047857]/40 pb-3">
                  <span className="text-emerald-500/80 text-xs font-bold uppercase tracking-wider">Price</span>
                  <span className="text-white font-bold text-lg">₹3,200</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-500/80 text-xs font-bold uppercase tracking-wider">Seller</span>
                  <span className="text-emerald-100/90 text-sm">Final Year, ECE</span>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-[#10b981] text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-lg border border-emerald-400 transform rotate-12">
                CAMPUS VERIFIED
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 border-b border-[#047857]/20 bg-[#02120c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-[#022c22]/40 border border-[#047857]/30 rounded-2xl p-8 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-[#10b981] mb-1">{stats.total || "500+"}</div>
              <div className="text-sm font-medium text-emerald-200/60 uppercase tracking-wider">Active Listings</div>
            </div>
            <div className="text-center border-l border-[#047857]/30">
              <div className="text-3xl font-extrabold text-[#10b981] mb-1">10</div>
              <div className="text-sm font-medium text-emerald-200/60 uppercase tracking-wider">Categories</div>
            </div>
            <div className="text-center border-t md:border-t-0 md:border-l border-[#047857]/30 pt-6 md:pt-0">
              <div className="text-3xl font-extrabold text-[#10b981] mb-1">1,200+</div>
              <div className="text-sm font-medium text-emerald-200/60 uppercase tracking-wider">Students Joined</div>
            </div>
            <div className="text-center border-t md:border-t-0 border-l border-[#047857]/30 pt-6 md:pt-0">
              <div className="text-3xl font-extrabold text-[#10b981] mb-1">Zero</div>
              <div className="text-sm font-medium text-emerald-200/60 uppercase tracking-wider">Listing Fees</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-[#02120c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#10b981] font-bold tracking-wider uppercase text-xs mb-2 block">Categories</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Find exactly what you need</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((cat) => (
              <CategoryCard key={cat} name={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest products */}
      <section className="py-20 bg-[#022c22]/10 border-y border-[#047857]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[#10b981] font-bold tracking-wider uppercase text-xs mb-2 block">Fresh listings</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Latest Products</h2>
            </div>
            <Button variant="ghost" onClick={() => navigate("/browse")}>View all listings →</Button>
          </div>
          
          {loading ? (
            <Loader />
          ) : latest.length === 0 ? (
            <EmptyState title="No listings yet" message="Be the first to list something on IITBHU Deals." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latest.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular products */}
      {popular.length > 0 && (
        <section className="py-20 bg-[#02120c]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-[#10b981] font-bold tracking-wider uppercase text-xs mb-2 block">Worth a look</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Popular Products</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popular.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why IITBHU Deals */}
      <section className="py-20 bg-[#022c22]/20 border-y border-[#047857]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#10b981] font-bold tracking-wider uppercase text-xs mb-2 block">Why IITBHU Deals</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Built to fix what WhatsApp groups can't</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WHY_PLATFORM.map(({ icon: Icon, title, text }) => (
              <div className="bg-[#02120c] border border-[#047857]/40 p-8 rounded-2xl hover:border-emerald-500 hover:-translate-y-1 transition-all duration-300 group shadow-lg" key={title}>
                <div className="w-14 h-14 bg-[#022c22] rounded-xl flex items-center justify-center text-[#10b981] mb-6 group-hover:scale-110 transition-transform">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-emerald-100/70 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-[#02120c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#10b981] font-bold tracking-wider uppercase text-xs mb-2 block">How it works</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">From listing to handover in four steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-[2px] bg-[#047857]/30 z-0"></div>
            {STEPS.map((step, i) => (
              <div className="relative z-10 flex flex-col items-center text-center" key={step.title}>
                <div className="w-12 h-12 rounded-full bg-[#10b981] text-[#02120c] flex items-center justify-center font-extrabold text-xl mb-6 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                  {i + 1}
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                <p className="text-sm text-emerald-100/60 leading-relaxed px-4">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#022c22]/10 border-t border-[#047857]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#10b981] font-bold tracking-wider uppercase text-xs mb-2 block">From students</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">What users are saying</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div className="bg-[#02120c] border border-[#047857]/40 p-8 rounded-2xl flex flex-col h-full shadow-lg" key={t.name}>
                <p className="text-emerald-100/80 italic mb-8 flex-grow leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-4 pt-6 border-t border-[#047857]/30">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#10b981] to-[#047857] flex items-center justify-center text-white font-bold text-lg shadow-inner">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-bold">{t.name}</div>
                    <div className="text-emerald-400/70 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#02120c]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#022c22] to-[#047857] rounded-3xl p-10 md:p-16 text-center border border-[#10b981]/30 shadow-[0_20px_50px_rgba(4,120,87,0.2)]">
            <FiUsers className="w-16 h-16 mx-auto text-[#10b981] mb-6 drop-shadow-md" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to clear out your hostel room?</h2>
            <p className="text-emerald-100/80 text-lg mb-10 max-w-2xl mx-auto">
              List your first product in under two minutes — it's free.
            </p>
            <Button variant="primary" size="lg" onClick={() => navigate("/sell")} className="px-10 py-4 text-lg font-bold shadow-xl shadow-[#02120c]">
              <span className="flex items-center gap-2">
                <FiTrendingUp /> Start Selling
              </span>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Landing;