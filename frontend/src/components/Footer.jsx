import { Link } from "react-router-dom";
import { CATEGORIES } from "../utils/constants.js";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#02120c] border-t border-[#047857]/40 pt-12 pb-6 text-emerald-100/70 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          <div className="flex flex-col space-y-4 pr-4">
            <h4 className="text-white font-bold tracking-wide text-lg mb-1">IITBHU Deals</h4>
            <p className="text-sm leading-relaxed text-emerald-200/60">
              A dedicated marketplace for students to buy and sell second-hand books,
              electronics, and hostel essentials — inside your own campus.
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <h4 className="text-white font-bold tracking-wide text-lg mb-1">Explore</h4>
            <Link to="/browse" className="text-sm hover:text-[#10b981] transition-colors w-fit">Browse Products</Link>
            <Link to="/sell" className="text-sm hover:text-[#10b981] transition-colors w-fit">Sell a Product</Link>
            <Link to="/my-products" className="text-sm hover:text-[#10b981] transition-colors w-fit">My Products</Link>
          </div>

          <div className="flex flex-col space-y-3">
            <h4 className="text-white font-bold tracking-wide text-lg mb-1">Categories</h4>
            {CATEGORIES.slice(0, 4).map((cat) => (
              <Link key={cat} to={`/browse?category=${encodeURIComponent(cat)}`} className="text-sm hover:text-[#10b981] transition-colors w-fit">
                {cat}
              </Link>
            ))}
          </div>

          <div className="flex flex-col space-y-3">
            <h4 className="text-white font-bold tracking-wide text-lg mb-1">Account</h4>
            <Link to="/login" className="text-sm hover:text-[#10b981] transition-colors w-fit">Login</Link>
            <Link to="/register" className="text-sm hover:text-[#10b981] transition-colors w-fit">Register</Link>
            <Link to="/profile" className="text-sm hover:text-[#10b981] transition-colors w-fit">Profile</Link>
          </div>

        </div>
        
        <div className="border-t border-[#047857]/30 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-emerald-300/50">
          <span>&copy; {year} IITBHU Deals. Built for students, by students.</span>
          <span>Buy. Sell. Save. Inside Your Campus.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;