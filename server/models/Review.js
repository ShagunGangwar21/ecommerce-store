const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    product: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Please add a rating between 1 and 5"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Please add a review comment"],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting more than one review per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to get avg rating and update product
reviewSchema.statics.getAverageRating = async function (productId) {
  try {
    const obj = await this.aggregate([
      {
        $match: { product: String(productId) },
      },
      {
        $group: {
          _id: "$product",
          averageRating: { $avg: "$rating" },
          numReviews: { $sum: 1 },
        },
      },
    ]);

    if (obj && obj.length > 0) {
      await this.model("Product").findByIdAndUpdate(productId, {
        rating: Math.round(obj[0].averageRating * 10) / 10,
        numReviews: obj[0].numReviews,
      }).catch(() => {});
    } else {
      await this.model("Product").findByIdAndUpdate(productId, {
        rating: 0,
        numReviews: 0,
      }).catch(() => {});
    }
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
reviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.product);
});

if (mongoose.models && mongoose.models.Review) {
  delete mongoose.models.Review;
}

module.exports = mongoose.model("Review", reviewSchema);
