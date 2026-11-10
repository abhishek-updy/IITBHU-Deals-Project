import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Books",
        "Electronics",
        "Cycles",
        "Furniture",
        "Hostel Essentials",
        "Lab Equipment",
        "Calculators",
        "Sports",
        "Stationery",
        "Others",
      ],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      max: [500000, "Price cannot exceed ₹5,00,000"],
    },
    condition: {
      type: String,
      required: [true, "Condition is required"],
      enum: ["New", "Like New", "Good", "Fair", "Old"],
    },
    images: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      trim: true,
      default: "", // We can use this to store hostel names like Morvi, CV Raman, Rajputana, etc.
    },
    // Store basic seller details directly in the product document 
    // so the app can load products faster without extra database searches.
    seller: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      department: { type: String, required: true },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Available", "Sold"],
      default: "Available",
    },
  },
  { timestamps: true }
);

// Enable text search so students can easily find products using the search bar.
productSchema.index({
  title: "text",
  description: "text",
  "seller.name": "text",
  "seller.department": "text",
});

const Product = mongoose.model("Product", productSchema);

export default Product;