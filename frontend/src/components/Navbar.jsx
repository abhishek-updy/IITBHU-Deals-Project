import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth.js";
import { useTheme } from "../hooks/useTheme.js";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  // Active / Inactive link styling helper for Tailwind
  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-[#047857] text-white shadow-sm"
        : "text-gray-300 hover:text-white hover:bg-[#047857]/40"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-[#022c22]/90 backdrop-blur-md border-b border-[#047857]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2.5 font-bold text-lg text-white tracking-wide group" 
          onClick={closeMenu}
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#10b981] to-[#047857] flex items-center justify-center text-white text-sm font-extrabold shadow-md group-hover:scale-105 transition-transform">
            IB
          </span>
          <span className="bg-gradient-to-r from-white via-emerald-100 to-emerald-400 bg-clip-text text-transparent">
            IITBHU Deals
          </span>
        </Link>

        {/* Navigation Links (Desktop & Mobile Drawer) */}
        <nav
          className={`absolute md:static top-16 left-0 w-full md:w-auto bg-[#022c22] md:bg-transparent border-b md:border-none border-[#047857]/40 px-6 py-4 md:p-0 flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-1 transition-all duration-300 shadow-xl md:shadow-none ${
            menuOpen ? "flex" : "hidden md:flex"
          }`}
        >
          <NavLink to="/" className={navLinkClass} onClick={closeMenu} end>
            Home
          </NavLink>
          <NavLink to="/browse" className={navLinkClass} onClick={closeMenu}>
            Browse Products
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink to="/sell" className={navLinkClass} onClick={closeMenu}>
                Sell Product
              </NavLink>
              <NavLink to="/my-products" className={navLinkClass} onClick={closeMenu}>
                My Products
              </NavLink>
              <NavLink to="/profile" className={navLinkClass} onClick={closeMenu}>
                Profile
              </NavLink>
            </>
          )}

          {!isAuthenticated && (
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full md:w-auto mt-2 md:mt-0 md:ml-4 pt-2 md:pt-0 border-t md:border-t-0 border-[#047857]/40">
              <NavLink
                to="/login"
                onClick={closeMenu}
                className="px-4 py-2 rounded-lg text-sm font-medium text-emerald-300 hover:text-white hover:bg-[#047857]/30 text-center transition-colors"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                onClick={closeMenu}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[#10b981] text-white hover:bg-[#059669] text-center shadow-md transition-all"
              >
                Register
              </NavLink>
            </div>
          )}

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="w-full md:w-auto text-left md:text-center px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors mt-2 md:mt-0 md:ml-2"
            >
              Logout
            </button>
          )}
        </nav>

        {/* Right Actions (Theme Toggle, User Avatar, Burger Menu) */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark and light theme"
            title="Toggle theme"
            className="p-2 rounded-lg bg-[#02120c] border border-[#047857]/50 text-emerald-400 hover:text-white hover:border-emerald-500 transition-colors"
          >
            {theme === "light" ? <FiMoon className="w-4 h-4" /> : <FiSun className="w-4 h-4" />}
          </button>

          {isAuthenticated && user && (
            <Link
              to="/profile"
              className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#02120c] border border-[#047857]/60 hover:border-emerald-500 transition-colors"
            >
              <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#10b981] to-[#047857] text-white flex items-center justify-center font-bold text-xs shadow">
                {user.name?.charAt(0)?.toUpperCase()}
              </span>
              <span className="text-xs font-semibold text-emerald-200">
                {user.name?.split(" ")[0]}
              </span>
            </Link>
          )}

          {/* Mobile Menu Burger Button */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            className="md:hidden p-2 rounded-lg bg-[#02120c] border border-[#047857]/50 text-emerald-400 hover:text-white"
          >
            {menuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;