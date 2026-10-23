import { Link } from "react-router-dom";
import { resolveImageUrl } from "../utils/constants.js";

const timeAgo = (dateString) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
};

const ProductCard = ({ product }) => {
  const isSold = product.status === "Sold";

  return (
    <div className="flex flex-col rounded-2xl bg-[#022c22]/80 border border-[#047857]/40 overflow-hidden hover:border-emerald-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(4,120,87,0.15)] transition-all duration-300 group">
      
      {/* Media Container */}
      <Link to={`/products/${product._id}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-[#02120c]">
        <img 
          src={resolveImageUrl(product.images?.[0])} 
          alt={product.title} 
          loading="lazy" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        
        {/* Condition / Sold Stamp */}
        <div 
          className={`absolute top-3 right-3 px-3 py-1 text-[10px] font-extrabold tracking-wider uppercase rounded-full shadow-md backdrop-blur-md border ${
            isSold 
              ? "bg-red-500/90 text-white border-red-400/50" 
              : "bg-[#02120c]/80 text-emerald-300 border-[#047857]/80"
          }`}
        >
          {isSold ? "SOLD" : product.condition}
        </div>
      </Link>
      
      {/* Card Body */}
      <div className="flex flex-col p-5 flex-grow">
        <span className="text-xs font-semibold text-emerald-500/80 mb-1.5 uppercase tracking-wider">
          {product.category}
        </span>
        <Link 
          to={`/products/${product._id}`} 
          className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-[#10b981] transition-colors"
        >
          {product.title}
        </Link>
        <span className="text-xl font-extrabold text-[#10b981] mb-4">
          ₹{Number(product.price).toLocaleString("en-IN")}
        </span>
        
        {/* Meta Info (Seller & Time) */}
        <div className="flex items-center justify-between text-xs font-medium text-emerald-200/60 mt-auto pt-3 border-t border-[#047857]/30">
          <span className="truncate pr-2">{product.seller?.name || "Anonymous"}</span>
          <span className="whitespace-nowrap">{timeAgo(product.createdAt)}</span>
        </div>
      </div>

    </div>
  );
};

export default ProductCard;