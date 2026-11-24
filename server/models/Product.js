const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please add a product title"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    image: {
      type: String,
      required: [true, "Please add an image URL"],
    },
    images: [
      {
        type: String,
      },
    ],
    brand: {
      type: String,
      default: "Generic",
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
      min: [0, "Price cannot be negative"],
    },
    salePrice: {
      type: Number,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: [true, "Please add count in stock"],
      min: [0, "Stock cannot be negative"],
      default: 10,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + "-" + Date.now().toString().slice(-4);
  }
  next();
});

// Index for text search
productSchema.index({ title: "text", description: "text", category: "text", brand: "text" });

module.exports = mongoose.model("Product", productSchema);
