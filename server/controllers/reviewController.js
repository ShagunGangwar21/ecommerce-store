const Review = require("../models/Review");
const mongoose = require("mongoose");

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Public / Private
const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment, name, userId } = req.body;
    const productId = String(req.params.id);

    const reviewerUser = String(
      req.user?._id ||
      req.user?.id ||
      userId ||
      req.headers["x-user-id"] ||
      "guest_" + Date.now()
    );

    const reviewerName = req.user?.name || name || "Anonymous User";

    // Check if user already reviewed this product
    const existing = await Review.collection.findOne({
      product: productId,
      user: reviewerUser,
    });

    if (existing) {
      res.status(400);
      throw new Error("You have already reviewed this product");
    }

    const newReviewDoc = {
      product: productId,
      user: reviewerUser,
      name: reviewerName,
      rating: Number(rating),
      comment: comment,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await Review.collection.insertOne(newReviewDoc);
    newReviewDoc._id = result.insertedId;

    res.status(201).json({ success: true, review: newReviewDoc });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const productId = String(req.params.id);
    const reviews = await Review.collection
      .find({ product: productId })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Public / Private (Owner or Admin)
const deleteProductReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    let queryId;
    if (mongoose.Types.ObjectId.isValid(reviewId)) {
      queryId = new mongoose.Types.ObjectId(reviewId);
    } else {
      queryId = reviewId;
    }

    const review = await Review.collection.findOne({
      $or: [{ _id: queryId }, { _id: String(reviewId) }, { id: reviewId }],
    });

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    const currentUserId = String(
      req.user?._id ||
      req.user?.id ||
      req.body?.userId ||
      req.headers["x-user-id"] ||
      ""
    );

    const reviewUserId = String(review.user || "");
    const isAdmin = req.user?.role === "admin";

    // Only creator of the review (or admin) can delete it
    if (
      reviewUserId &&
      currentUserId &&
      reviewUserId !== currentUserId &&
      !isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own review",
      });
    }

    await Review.collection.deleteOne({ _id: review._id });

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProductReview,
  getProductReviews,
  deleteProductReview,
};
