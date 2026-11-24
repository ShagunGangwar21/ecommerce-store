const Category = require("../models/Category");
const Product = require("../models/Product");

// @desc    Get all categories with product counts
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({}).sort("name");
    
    // Get product counts per category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({
          category: { $regex: `^${cat.name}$`, $options: "i" },
        });
        return {
          ...cat.toObject(),
          productCount: count,
        };
      })
    );

    res.json({ success: true, categories: categoriesWithCount });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;

    if (!name) {
      res.status(400);
      throw new Error("Category name is required");
    }

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      res.status(400);
      throw new Error("Category already exists");
    }

    const category = await Category.create({ name, description, image });
    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    const category = await Category.findById(req.params.id);

    if (category) {
      if (name) category.name = name;
      if (description !== undefined) category.description = description;
      if (image !== undefined) category.image = image;

      const updatedCategory = await category.save();
      res.json({ success: true, category: updatedCategory });
    } else {
      res.status(404);
      throw new Error("Category not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      await category.deleteOne();
      res.json({ success: true, message: "Category deleted" });
    } else {
      res.status(404);
      throw new Error("Category not found");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
