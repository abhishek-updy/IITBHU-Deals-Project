import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import MainLayout from "../layouts/MainLayout.jsx";
import ProductCard from "../components/ProductCard.jsx";
import FilterSidebar from "../components/FilterSidebar.jsx";
import Pagination from "../components/Pagination.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { getProducts } from "../services/productService.js";
import { SORT_OPTIONS } from "../utils/constants.js";

const DEFAULT_FILTERS = { category: "", minPrice: "", maxPrice: "", condition: "" };

const BrowseProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("search") || "");
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    condition: searchParams.get("condition") || "",
  });
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Debounce search input by 250ms for buttery-smooth typing and live auto-filter
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 250);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search: debouncedSearch || undefined,
        category: filters.category || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        condition: filters.condition || undefined,
        sort,
        page,
        limit: 12,
      };
      const res = await getProducts(params);
      setProducts(res.data);
      setPagination(res.pagination);
    } catch (error) {
      // Keep the page usable even if a request fails; the empty state covers it.
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters, sort, page]);

  useEffect(() => {
    fetchProducts();
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (filters.category) params.category = filters.category;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.condition) params.condition = filters.condition;
    if (sort !== "newest") params.sort = sort;
    if (page !== 1) params.page = page;
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filters, sort, page]);

  const handleFilterChange = (next) => {
    setFilters(next);
    setPage(1);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setSearch("");
    setDebouncedSearch("");
    setPage(1);
  };

  return (
    <MainLayout>
      <div className="w-full max-w-7xl mr-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-wide">Browse Products</h1>
          <p className="text-emerald-200/70 text-sm md:text-base">
            Search and filter listings from students across your campus.
          </p>
        </div>

        {/* Search & Sort Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 bg-[#022c22]/60 p-4 rounded-2xl border border-[#047857]/40 backdrop-blur-sm shadow-lg">
          
          <div className="flex items-center w-full bg-[#02120c] border border-[#047857]/50 rounded-xl px-4 py-2.5 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/50 shadow-sm transition-all">
            <FiSearch className="mr-3 text-emerald-500/70 shrink-0 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products, categories, sellers, departments..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-transparent border-none outline-none text-white placeholder-emerald-600/70 font-medium text-sm"
            />
          </div>

          <select
            className="w-full sm:w-48 bg-[#02120c] border border-[#047857]/50 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 shrink-0 cursor-pointer hover:border-[#047857] transition-colors"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#02120c]">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Main Browse Layout */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <FilterSidebar filters={filters} onChange={handleFilterChange} onReset={handleReset} />

          {/* Product Grid Area */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#047857]/30">
              <span className="text-sm font-semibold text-emerald-300">
                {loading ? "Loading..." : `${pagination.total} product${pagination.total === 1 ? "" : "s"} found`}
              </span>
            </div>

            {loading ? (
              <Loader />
            ) : products.length === 0 ? (
              <EmptyState
                title="No products match your search"
                message="Try adjusting your filters or search terms."
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>
                
                <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} />
              </>
            )}
          </div>
          
        </div>
      </div>
    </MainLayout>
  );
};

export default BrowseProducts;