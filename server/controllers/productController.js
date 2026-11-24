const Product = require("../models/Product");

// @desc    Fetch all products with search, filter, sorting, pagination
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    let query = {};

    // Search Keyword
    if (req.query.keyword) {
      query.$or = [
        { title: { $regex: req.query.keyword, $options: "i" } },
        { description: { $regex: req.query.keyword, $options: "i" } },
        { category: { $regex: req.query.keyword, $options: "i" } },
        { brand: { $regex: req.query.keyword, $options: "i" } },
      ];
    }

    // Category Filter
    if (req.query.category) {
      query.category = { $regex: `^${req.query.category}$`, $options: "i" };
    }

    // Price Filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Sorting
    let sort = { createdAt: -1 };
    if (req.query.sort) {
      if (req.query.sort === "price_asc") sort = { price: 1 };
      else if (req.query.sort === "price_desc") sort = { price: -1 };
      else if (req.query.sort === "rating") sort = { rating: -1 };
      else if (req.query.sort === "oldest") sort = { createdAt: 1 };
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      success: true,
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top rated / featured products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(5);
    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product by ID or Slug
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    let product;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(req.params.id);
    } else {
      product = await Product.findOne({ slug: req.params.id });
    }

    if (product) {
      res.json({ success: true, product });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { title, price, description, image, category, brand, countInStock, isFeatured } = req.body;

    const product = new Product({
      user: req.user._id,
      title: title || "Sample Product",
      price: price || 0,
      description: description || "Sample description",
      image: image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      category: category || "General",
      brand: brand || "Generic",
      countInStock: countInStock !== undefined ? countInStock : 10,
      isFeatured: isFeatured || false,
    });

    const createdProduct = await product.save();
    res.status(201).json({ success: true, product: createdProduct });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const { title, price, description, image, category, brand, countInStock, isFeatured } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      if (title) product.title = title;
      if (price !== undefined) product.price = price;
      if (description) product.description = description;
      if (image) product.image = image;
      if (category) product.category = category;
      if (brand) product.brand = brand;
      if (countInStock !== undefined) product.countInStock = countInStock;
      if (isFeatured !== undefined) product.isFeatured = isFeatured;

      const updatedProduct = await product.save();
      res.json({ success: true, product: updatedProduct });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ success: true, message: "Product removed" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getTopProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};