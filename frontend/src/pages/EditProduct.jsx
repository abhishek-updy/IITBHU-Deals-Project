import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiUploadCloud, FiX } from "react-icons/fi";
import MainLayout from "../layouts/MainLayout.jsx";
import Button from "../components/Button.jsx";
import Loader from "../components/Loader.jsx";
import { getProductById, updateProduct } from "../services/productService.js";
import { CATEGORIES, CONDITIONS, resolveImageUrl } from "../utils/constants.js";
import { compressImage } from "../utils/compressImage.js";

const MAX_IMAGES = 6;

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProductById(id)
      .then((res) => {
        const p = res.data;
        setForm({
          title: p.title,
          description: p.description,
          category: p.category,
          price: p.price,
          condition: p.condition,
          location: p.location || "",
        });
        setExistingImages(p.images || []);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFiles = async (fileList) => {
    const room = MAX_IMAGES - existingImages.length - newImages.length;
    const rawFiles = Array.from(fileList).slice(0, Math.max(room, 0));
    if (rawFiles.length === 0) return;

    // Automatically compress heavy iPhone/Android photos in background
    const compressedFiles = await Promise.all(rawFiles.map((f) => compressImage(f)));

    setNewImages((prev) => [...prev, ...compressedFiles]);
    setNewPreviews((prev) => [...prev, ...compressedFiles.map((f) => URL.createObjectURL(f))]);
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateProduct(id, form, newImages);
      toast.success("Product updated successfully");
      navigate(`/products/${updated._id}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full bg-[#02120c] border border-[#047857]/50 rounded-xl px-4 py-3 text-white placeholder-emerald-600/70 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all";
  const labelClass = "block text-sm font-semibold text-emerald-100/80 mb-1.5";

  if (loading || !form) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Loader />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-wide">Edit Product</h1>
          <p className="text-emerald-200/70 text-sm md:text-base">
            Update your listing's details, or add more photos.
          </p>
        </div>

        <form className="bg-[#022c22]/60 p-6 md:p-8 rounded-2xl border border-[#047857]/40 backdrop-blur-sm shadow-xl space-y-6" onSubmit={handleSubmit}>
          
          <div>
            <label className={labelClass} htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              className={inputClass}
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
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass} htmlFor="category">Category</label>
              <select id="category" name="category" className={inputClass} value={form.category} onChange={handleChange} required>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#02120c]">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="condition">Condition</label>
              <select id="condition" name="condition" className={inputClass} value={form.condition} onChange={handleChange} required>
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
                max="500000"
                className={inputClass}
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
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. CV Raman Hostel"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Current Images</label>
            <div className="flex flex-wrap gap-4 mt-3">
              {existingImages.map((img) => (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-[#047857]/50" key={img}>
                  <img src={resolveImageUrl(img)} alt="Product" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <span className="block text-xs text-emerald-300/50 mt-2">
              To remove an old photo, delete the listing and re-list it.
            </span>
          </div>

          <div>
            <label className={labelClass}>Add More Images</label>
            <label 
              className="flex flex-col items-center justify-center w-full h-32 mt-2 border-2 border-dashed border-[#047857]/60 rounded-xl bg-[#02120c]/50 hover:bg-[#047857]/10 hover:border-emerald-500 transition-colors cursor-pointer text-emerald-400 group" 
              htmlFor="images"
            >
              <FiUploadCloud size={28} className="group-hover:scale-110 transition-transform duration-300" />
              <p className="mt-3 text-sm font-medium text-emerald-200">Click to upload additional photos</p>
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
            {newPreviews.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {newPreviews.map((src, i) => (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-emerald-500/50 shadow-sm" key={src}>
                    <img src={src} alt={`New ${i + 1}`} className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeNewImage(i)} 
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

          <div className="pt-2">
            <Button type="submit" variant="primary" block loading={saving}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default EditProduct;