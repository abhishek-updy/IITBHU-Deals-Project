import { FiSearch } from "react-icons/fi";

// Controlled search input used on both the landing hero and the browse page.
// Submits on Enter or the search icon click.
const SearchBar = ({ value, onChange, onSubmit, placeholder = "Search products, categories, sellers...", variant = "hero" }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSubmit?.(value);
  };

  const isHero = variant === "hero";

  return (
    <div 
      className={`flex items-center w-full transition-all duration-300 ${
        isHero 
          ? "bg-[#02120c]/80 backdrop-blur-md border-2 border-[#047857]/60 rounded-full p-2 shadow-2xl focus-within:border-[#10b981] focus-within:shadow-[0_0_25px_rgba(16,185,129,0.25)]" 
          : "bg-[#02120c] border border-[#047857]/50 rounded-xl px-4 py-2.5 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/50 shadow-sm"
      }`}
    >
      <button 
        onClick={() => onSubmit?.(value)} 
        className={`${isHero ? "pl-4 text-emerald-400 hover:text-emerald-300" : "pr-3 text-emerald-500/70 shrink-0 hover:text-emerald-400"}`}
        aria-label="Submit search"
      >
        <FiSearch className={isHero ? "w-6 h-6" : "w-5 h-5"} />
      </button>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Search products"
        className={`w-full bg-transparent border-none outline-none text-white placeholder-emerald-600/70 font-medium ${
          isHero ? "px-4 text-lg" : "text-sm"
        }`}
      />
      
      {isHero && (
        <button 
          className="px-6 py-3 rounded-full bg-[#10b981] text-white font-bold hover:bg-[#059669] transition-colors shadow-lg shadow-emerald-900/30 shrink-0 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
          onClick={() => onSubmit?.(value)}
        >
          Search
        </button>
      )}
    </div>
  );
};

export default SearchBar;