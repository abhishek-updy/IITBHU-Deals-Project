import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  markProductSold,
  getMyProducts,
  getProductOwnerId,
} from "../controllers/productController.js";
import { protect, isOwner, optionalAuth } from "../middleware/auth.js";
import { productRules, handleValidation } from "../middleware/validate.js";
import upload from "../middleware/cloudinary.js"; // Added cloudinary middleware, cuz local per hoo nhi payega

const router = express.Router();

// Private route: Get the logged-in student's own products
router.get("/user/me", protect, getMyProducts);

// Public routes: Anyone can search and view products (optionalAuth ensures logged-in users see seller contact)
router.get("/", optionalAuth, getProducts);
router.get("/:id", optionalAuth, getProductById);

// Private route: Create a new product listing (allows up to 6 images)
router.post("/", protect, upload.array("images", 6), productRules, handleValidation, createProduct);

// Private routes: Update, delete, or mark a product as sold (only if the student owns it)
router.put(
  "/:id",
  protect,
  isOwner(getProductOwnerId),
  upload.array("images", 6),
  updateProduct
);

router.delete("/:id", protect, isOwner(getProductOwnerId), deleteProduct);

router.patch("/:id/sold", protect, isOwner(getProductOwnerId), markProductSold);

export default router;