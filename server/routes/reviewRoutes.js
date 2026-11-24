// const express = require("express");
// const router = express.Router({ mergeParams: true });
// const {
//   createProductReview,
//   getProductReviews,
//   deleteProductReview,
// } = require("../controllers/reviewController");
// const { optionalProtect } = require("../middleware/authMiddleware");

// router
//   .route("/")
//   .get(getProductReviews)
//   .post(optionalProtect, createProductReview);

// router.route("/:reviewId").delete(optionalProtect, deleteProductReview);

// module.exports = router;

const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  createProductReview,
  getProductReviews,
  deleteProductReview,
} = require("../controllers/reviewController");
const { optionalProtect } = require("../middleware/authMiddleware");

// Match /api/products/:id/reviews
router
  .route("/:id/reviews")
  .get(getProductReviews)
  .post(optionalProtect, createProductReview);

// Match /api/products/:id/reviews/:reviewId
router
  .route("/:id/reviews/:reviewId")
  .delete(optionalProtect, deleteProductReview);

module.exports = router;