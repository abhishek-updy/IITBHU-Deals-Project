import { CATEGORIES, CONDITIONS } from "../utils/constants.js";

// Controlled filter panel for the Browse page: category, price range, and
// condition. `filters` and `onChange` are lifted to the parent so the query
// string / API call stays in sync with what's shown.
const FilterSidebar = ({ filters, onChange, onReset }) => {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  // Tailwind helper for chip styling (active vs inactive)
  const getChipClass = (isActive) =>
    `px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 ${
      isActive
        ? "bg-[#10b981] border-[#10b981] text-white shadow-md shadow-emerald-900/30"
        : "bg-[#02120c] border-[#047857]/50 text-emerald-300 hover:bg-[#047857]/40 hover:text-white"
    }`;

  return (
    <aside className="w-full md:w-64 shrink-0 bg-[#022c22]/80 p-5 rounded-2xl border border-[#047857]/40 h-fit space-y-6 shadow-lg backdrop-blur-sm">
      <h3 className="text-lg font-bold text-white tracking-wide border-b border-[#047857]/40 pb-3">Filters</h3>

      {/* Category Filter */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-emerald-100/80">Category</label>
        <div className="flex flex-wrap gap-2">
          <button
            className={getChipClass(!filters.category)}
            onClick={() => update("category", "")}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={getChipClass(filters.category === cat)}
              onClick={() => update("category", cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-emerald-100/80">Price Range (₹)</label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => update("minPrice", e.target.value)}
            className="w-full px-3 py-2 bg-[#02120c] border border-[#047857]/50 rounded-lg text-sm text-white placeholder-emerald-600/60 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
          />
          <span className="text-emerald-500/50">-</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => update("maxPrice", e.target.value)}
            className="w-full px-3 py-2 bg-[#02120c] border border-[#047857]/50 rounded-lg text-sm text-white placeholder-emerald-600/60 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Condition Filter */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-emerald-100/80">Condition</label>
        <div className="flex flex-wrap gap-2">
          <button
            className={getChipClass(!filters.condition)}
            onClick={() => update("condition", "")}
          >
            Any
          </button>
          {CONDITIONS.map((c) => (
            <button
              key={c}
              className={getChipClass(filters.condition === c)}
              onClick={() => update("condition", c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <button 
        className="w-full mt-2 px-4 py-2 text-sm font-medium text-emerald-300 hover:text-white hover:bg-[#047857]/20 rounded-lg transition-colors border border-transparent hover:border-[#047857]/50" 
        onClick={onReset}
      >
        Clear all filters
      </button>
    </aside>
  );
};

export default FilterSidebar;