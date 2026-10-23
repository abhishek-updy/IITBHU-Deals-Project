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
import { protect, isOwner } from "../middleware/auth.js";
import { productRules, handleValidation } from "../middleware/validate.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Private route: Get the logged-in student's own products
// (This must stay above /:id, otherwise Express will think "user" is a product ID)
router.get("/user/me", protect, getMyProducts);

// Public routes: Anyone can search and view products
router.get("/", getProducts);
router.get("/:id", getProductById);

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