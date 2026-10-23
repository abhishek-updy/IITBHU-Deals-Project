import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiUploadCloud, FiX } from "react-icons/fi";
import MainLayout from "../layouts/MainLayout.jsx";
import Button from "../components/Button.jsx";
import { createProduct } from "../services/productService.js";
import { CATEGORIES, CONDITIONS } from "../utils/constants.js";

const INITIAL_FORM = {
  title: "",
  description: "",
  category: "",
  price: "",
  condition: "",
  location: "",
};

const MAX_IMAGES = 6;

const SellProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [images, setImages] = useState([]); // File objects
  const [previews, setPreviews] = useState([]); // object URLs
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFiles = (fileList) => {
    const files = Array.from(fileList).slice(0, MAX_IMAGES - images.length);
    if (files.length === 0) return;

    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please add at least one product image");
      return;
    }

    setLoading(true);
    try {
      const product = await createProduct(form, images);
      toast.success("Product listed successfully!");
      navigate(`/products/${product._id}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-[#02120c] border border-[#047857]/50 rounded-xl px-4 py-3 text-white placeholder-emerald-600/70 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all";
  const labelClass = "block text-sm font-semibold text-emerald-100/80 mb-1.5";

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-wide">Sell a Product</h1>
          <p className="text-emerald-200/70 text-sm md:text-base">
            List an item for other students on your campus to find.
          </p>
        </div>

        <form className="bg-[#022c22]/60 p-6 md:p-10 rounded-3xl border border-[#047857]/40 backdrop-blur-sm shadow-xl space-y-6" onSubmit={handleSubmit}>
          
          <div>
            <label className={labelClass} htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              className={inputClass}
              placeholder="e.g. Casio FX-991ES Calculator"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className={`${inputClass} min-h-[120px] resize-y`}
              placeholder="Describe the item's condition, usage, and any accessories included"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass} htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                className={`${inputClass} cursor-pointer`}
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled className="bg-[#02120c] text-emerald-600/70">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#02120c]">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="condition">Condition</label>
              <select
                id="condition"
                name="condition"
                className={`${inputClass} cursor-pointer`}
                value={form.condition}
                onChange={handleChange}
                required
              >
                <option value="" disabled className="bg-[#02120c] text-emerald-600/70">Select condition</option>
                {CONDITIONS.map((c) => (
                  <option key={c} value={c} className="bg-[#02120c]">{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass} htmlFor="price">Price (₹)</label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                className={inputClass}
                placeholder="500"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                className={inputClass}
                placeholder="e.g. CV Raman Hostel"
                value={form.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Images (up to {MAX_IMAGES})</label>
            <label 
              className="flex flex-col items-center justify-center w-full h-32 mt-2 border-2 border-dashed border-[#047857]/60 rounded-xl bg-[#02120c]/50 hover:bg-[#047857]/10 hover:border-emerald-500 transition-colors cursor-pointer text-emerald-400 group" 
              htmlFor="images"
            >
              <FiUploadCloud size={28} className="group-hover:scale-110 transition-transform duration-300" />
              <p className="mt-3 text-sm font-medium text-emerald-200">Click to upload product photos</p>
              <span className="mt-1 text-xs text-emerald-500/70">JPG, PNG or WEBP — up to 5MB each</span>
            </label>
            <input
              id="images"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              hidden
              onChange={(e) => handleFiles(e.target.files)}
            />

            {previews.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {previews.map((src, i) => (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-emerald-500/50 shadow-sm" key={src}>
                    <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeImage(i)} 
                      aria-label="Remove image"
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#047857]/30 mt-6">
            <Button type="submit" variant="primary" block loading={loading}>
              Submit Listing
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default SellProduct;