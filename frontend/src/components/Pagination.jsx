// Renders numbered page buttons plus prev/next. Keeps things simple by
// showing every page — fine for a campus-scale marketplace's result counts.
const Pagination = ({ page, pages, onChange }) => {
  if (pages <= 1) return null;

  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

  const btnBase = "w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-emerald-500/50";

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={`${btnBase} ${
          page <= 1
            ? "opacity-50 cursor-not-allowed border-[#047857]/30 text-emerald-600/50 bg-[#02120c]"
            : "border-[#047857]/50 text-emerald-400 hover:bg-[#047857]/20 hover:text-white bg-[#02120c]"
        }`}
      >
        ‹
      </button>
      
      {pageNumbers.map((num) => (
        <button
          key={num}
          onClick={() => onChange(num)}
          className={`${btnBase} ${
            num === page
              ? "bg-[#10b981] border-[#10b981] text-white shadow-md shadow-emerald-900/30"
              : "bg-[#02120c] border-[#047857]/50 text-emerald-300 hover:bg-[#047857]/40 hover:text-white"
          }`}
        >
          {num}
        </button>
      ))}
      
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
        aria-label="Next page"
        className={`${btnBase} ${
          page >= pages
            ? "opacity-50 cursor-not-allowed border-[#047857]/30 text-emerald-600/50 bg-[#02120c]"
            : "border-[#047857]/50 text-emerald-400 hover:bg-[#047857]/20 hover:text-white bg-[#02120c]"
        }`}
      >
        ›
      </button>
    </div>
  );
};

export default Pagination;