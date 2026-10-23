import Product from "../models/Product.js";

// Get a list of products based on search, category filters, sorting, and page number
// Route: GET /api/products
// Access: Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      condition,
      status,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // If the user typed something in the search bar, look for it in text-indexed fields
    if (search) {
      query.$text = { $search: search }; 
    }

    if (category) query.category = category;
    if (condition) query.condition = condition;

    // Only show available items by default, unless they specifically ask for sold ones
    query.status = status || "Available";

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Determine how to sort the results
    let sortOption = { createdAt: -1 }; // Newest first by default
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "price_low") sortOption = { price: 1 };
    if (sort === "price_high") sortOption = { price: -1 };

    // Setup pagination math
    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.max(Number(limit), 1);
    const skip = (pageNum - 1) * limitNum;

    // Run both database queries at the same time to save time
    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOption).skip(skip).limit(limitNum),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get full details of a single product along with similar items
// Route: GET /api/products/:id
// Access: Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Find up to 4 other available products in the same category to show below
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }, // Exclude the current product
      status: "Available",
    })
      .limit(4)
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: product, related: relatedProducts });
  } catch (error) {
    next(error);
  }
};

// Add a new product to sell
// Route: POST /api/products
// Access: Private
export const createProduct = async (req, res, next) => {
  try {
    const { title, description, category, price, condition, location } = req.body;

    // Use Cloudinary secure URLs provided by multer-storage-cloudinary (`file.path`)
    const images = (req.files || []).map((file) => file.path);

    const product = await Product.create({
      title,
      description,
      category,
      price,
      condition,
      location,
      images,
      owner: req.user._id,
      seller: {
        name: req.user.name,
        phone: req.user.phone,
        department: req.user.department,
      },
    });

    res.status(201).json({ success: true, message: "Product listed successfully", data: product });
  } catch (error) {
    console.error("PRODUCT CREATE ERROR:", error); // Yeh line exact error terminal par dikhayegi
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

// Edit details of a product that the logged-in student owns
// Route: PUT /api/products/:id
// Access: Private (owner only)
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Only allow updating these specific fields
    const editableFields = ["title", "description", "category", "price", "condition", "location", "status"];
    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    // Add new Cloudinary image URLs to the existing ones if any were uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path);
      product.images = [...product.images, ...newImages];
    }

    const updatedProduct = await product.save();

    res.status(200).json({ success: true, message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    next(error);
  }
};

// Permanently delete a product
// Route: DELETE /api/products/:id
// Access: Private (owner only)
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    await product.deleteOne();

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Quickly switch a product between "Available" and "Sold"
// Route: PATCH /api/products/:id/sold
// Access: Private (owner only)
export const markProductSold = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.status = product.status === "Available" ? "Sold" : "Available";
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product marked as ${product.status}`,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Get the profile stats and list of products for the logged-in student
// Route: GET /api/products/user/me
// Access: Private
export const getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ owner: req.user._id }).sort({ createdAt: -1 });
    const postedCount = products.length;
    const soldCount = products.filter((p) => p.status === "Sold").length;

    res.status(200).json({
      success: true,
      data: products,
      stats: { postedCount, soldCount },
    });
  } catch (error) {
    next(error);
  }
};

// Helper used by the middleware to figure out who owns a product before allowing changes
export const getProductOwnerId = async (req) => {
  const product = await Product.findById(req.params.id);
  return product?.owner;
};