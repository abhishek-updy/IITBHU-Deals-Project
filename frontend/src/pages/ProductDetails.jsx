import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiPhone, FiUser, FiHome as FiDept, FiMapPin } from "react-icons/fi";
import MainLayout from "../layouts/MainLayout.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Button from "../components/Button.jsx";
import { getProductById } from "../services/productService.js";
import { resolveImageUrl } from "../utils/constants.js";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setActiveImage(0);
    getProductById(id)
      .then((res) => {
        setProduct(res.data);
        setRelated(res.related || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center">
          <Loader />
        </div>
      </MainLayout>
    );
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <EmptyState
            title="Product not found"
            message={error || "This listing may have been removed."}
            action={
              <Link to="/browse">
                <Button variant="primary">Back to Browse</Button>
              </Link>
            }
          />
        </div>
      </MainLayout>
    );
  }

  const images = product.images?.length ? product.images : [null];
  const isSold = product.status === "Sold";

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Top Section: Gallery + Details */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 mb-16">
          
          {/* Left Column: Image Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            {/* Main Active Image */}
            <div className="w-full aspect-[4/3] rounded-2xl bg-[#02120c] border border-[#047857]/40 overflow-hidden shadow-lg">
              <img 
                src={resolveImageUrl(images[activeImage])} 
                alt={product.title} 
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      i === activeImage 
                        ? "border-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.3)] opacity-100" 
                        : "border-[#047857]/40 opacity-60 hover:opacity-100 hover:border-emerald-500"
                    }`}
                  >
                    <img
                      src={resolveImageUrl(img)}
                      alt={`${product.title} thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <span className="text-sm font-bold text-emerald-500 uppercase tracking-wider mb-2 block">
              {product.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
              {product.title}
            </h1>
            <div className="text-4xl font-black text-[#10b981] mb-6">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest border shadow-sm ${
                isSold 
                  ? "bg-red-500/10 text-red-400 border-red-500/30 shadow-red-900/20" 
                  : "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30 shadow-emerald-900/20"
              }`}>
                {product.status}
              </span>
              <span className="px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest border border-[#047857]/50 bg-[#022c22] text-emerald-300 shadow-sm">
                {product.condition}
              </span>
            </div>

            <div className="prose prose-invert max-w-none mb-10">
              <p className="text-emerald-100/80 leading-relaxed whitespace-pre-line text-base md:text-lg">
                {product.description}
              </p>
            </div>

            {/* Seller Information Card */}
            <div className="bg-[#022c22]/60 border border-[#047857]/40 rounded-2xl p-6 shadow-xl backdrop-blur-sm mb-8 mt-auto">
              <h4 className="text-lg font-bold text-white mb-4 border-b border-[#047857]/40 pb-3">
                Seller Information
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2.5 text-emerald-400/80 text-sm font-medium">
                    <FiUser size={16} /> Name
                  </span>
                  <span className="text-white font-semibold text-sm">{product.seller?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2.5 text-emerald-400/80 text-sm font-medium">
                    <FiDept size={16} /> Department
                  </span>
                  <span className="text-white font-semibold text-sm">{product.seller?.department}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2.5 text-emerald-400/80 text-sm font-medium">
                    <FiPhone size={16} /> Phone
                  </span>
                  <span className="text-white font-semibold text-sm">{product.seller?.phone}</span>
                </div>
                {product.location && (
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2.5 text-emerald-400/80 text-sm font-medium">
                      <FiMapPin size={16} /> Location
                    </span>
                    <span className="text-white font-semibold text-sm">{product.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Button */}
            <a href={isSold ? undefined : `tel:${product.seller?.phone}`} className={`block w-full ${isSold ? "cursor-not-allowed" : ""}`}>
              <Button variant={isSold ? "outline" : "primary"} size="lg" block disabled={isSold} className="py-4 text-lg font-bold">
                {isSold ? "Already Sold" : "Contact Seller"}
              </Button>
            </a>
          </div>
        </div>

        {/* Related Products Section */}
        {related.length > 0 && (
          <section className="pt-12 border-t border-[#047857]/30">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}

      </div>
    </MainLayout>
  );
};

export default ProductDetails;