import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2, FiCheckCircle, FiPackage } from "react-icons/fi";
import MainLayout from "../layouts/MainLayout.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Button from "../components/Button.jsx";
import Modal from "../components/Modal.jsx";
import { getMyProducts, deleteProduct, toggleSold } from "../services/productService.js";
import { resolveImageUrl } from "../utils/constants.js";

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ postedCount: 0, soldCount: 0 });
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getMyProducts();
      setProducts(res.data);
      setStats(res.stats);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggleSold = async (id) => {
    try {
      await toggleSold(id);
      load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(confirmDeleteId);
      toast.success("Product deleted");
      setConfirmDeleteId(null);
      load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#047857]/30 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-2 tracking-wide">My Products</h1>
            <p className="text-emerald-200/70 text-sm md:text-base">
              <span className="font-bold text-[#10b981]">{stats.postedCount}</span> posted · <span className="font-bold text-[#10b981]">{stats.soldCount}</span> sold
            </p>
          </div>
          <Link to="/sell" className="shrink-0">
            <Button variant="primary" className="w-full sm:w-auto">Sell a Product</Button>
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <Loader />
        ) : products.length === 0 ? (
          <EmptyState
            icon={FiPackage}
            title="You haven't listed anything yet"
            message="List your first product and reach students on your campus."
            action={
              <Link to="/sell">
                <Button variant="primary">Sell a Product</Button>
              </Link>
            }
          />
        ) : (
          <div className="flex flex-col gap-4">
            {products.map((p) => (
              <div 
                className="flex flex-col md:flex-row items-center gap-5 p-4 rounded-2xl bg-[#022c22]/60 border border-[#047857]/40 backdrop-blur-sm shadow-sm hover:border-emerald-500 hover:shadow-md transition-all duration-300" 
                key={p._id}
              >
                {/* Image */}
                <div className="w-full md:w-32 h-40 md:h-24 shrink-0 rounded-xl overflow-hidden bg-[#02120c] border border-[#047857]/50">
                  <img src={resolveImageUrl(p.images?.[0])} alt={p.title} className="w-full h-full object-cover" />
                </div>
                
                {/* Info */}
                <div className="flex-1 w-full text-center md:text-left">
                  <h4 className="text-lg font-bold text-white mb-2 line-clamp-1">{p.title}</h4>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm text-emerald-200/70">
                    <span className="font-extrabold text-[#10b981]">₹{Number(p.price).toLocaleString("en-IN")}</span>
                    <span className="text-[#047857]">•</span>
                    <span>{p.category}</span>
                    <span className="text-[#047857]">•</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                      p.status === "Sold" 
                        ? "bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]" 
                        : "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t border-[#047857]/30 md:border-none">
                  <Link to={`/products/${p._id}`}>
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                  <Link to={`/products/${p._id}/edit`}>
                    <Button variant="outline" size="sm" className="flex items-center gap-1.5"><FiEdit2 size={14} /> Edit</Button>
                  </Link>
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5" onClick={() => handleToggleSold(p._id)}>
                    <FiCheckCircle size={14} /> {p.status === "Sold" ? "Mark Available" : "Mark Sold"}
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => setConfirmDeleteId(p._id)}>
                    <FiTrash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal open={!!confirmDeleteId} title="Delete this product?" onClose={() => setConfirmDeleteId(null)}>
        <p className="text-emerald-100/80 mb-6 leading-relaxed">
          This action cannot be undone. The listing will be permanently removed from IITBHU Deals.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" block onClick={() => setConfirmDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" block onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </MainLayout>
  );
};

export default MyProducts;