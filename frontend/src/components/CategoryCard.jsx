import { Link } from "react-router-dom";
import {
  FiBook,
  FiCpu,
  FiWind,
  FiHome,
  FiCoffee,
  FiTool,
  FiHash,
  FiActivity,
  FiEdit3,
  FiGrid,
} from "react-icons/fi";

const ICONS = {
  Books: FiBook,
  Electronics: FiCpu,
  Cycles: FiWind,
  Furniture: FiHome,
  "Hostel Essentials": FiCoffee,
  "Lab Equipment": FiTool,
  Calculators: FiHash,
  Sports: FiActivity,
  Stationery: FiEdit3,
  Others: FiGrid,
};

const CategoryCard = ({ name }) => {
  const Icon = ICONS[name] || FiGrid;

  return (
    <Link 
      to={`/browse?category=${encodeURIComponent(name)}`} 
      className="flex flex-col items-center justify-center gap-4 p-6 rounded-2xl bg-[#022c22] border border-[#047857]/40 hover:border-emerald-500 hover:bg-[#047857]/20 hover:-translate-y-1 transition-all duration-300 group shadow-lg"
    >
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#02120c] border border-[#047857]/50 text-emerald-400 group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all duration-300 text-2xl">
        <Icon />
      </div>
      <div className="text-sm font-semibold text-emerald-100/80 group-hover:text-white text-center tracking-wide transition-colors">
        {name}
      </div>
    </Link>
  );
};

export default CategoryCard;