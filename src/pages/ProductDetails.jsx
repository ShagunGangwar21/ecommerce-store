import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import products from "../data/Products";
import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import ProductCard from "../components/Productcard";
import { apiCall } from "../services/api";
import { useAuth } from "../context/AuthContext";

import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaShoppingCart,
  FaTruck,
  FaSync,
  FaShieldAlt,
  FaArrowLeft,
  FaComment,
  FaTrash,
} from "react-icons/fa";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();

  const product =
    products.find((item) => item.id === Number(id)) || products[0];

  const [selectedImage, setSelectedImage] = useState(product?.image || "");
  const [quantity, setQuantity] = useState(1);

  // Reviews
  const [reviewsList, setReviewsList] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);

  const isLiked = isInWishlist(product.id);

  // =========================
  // ADD TO CART
  // =========================
  const handleAddToCart = () => {
    addToCart(product, quantity);

    addToast(
      `Added ${quantity} x "${product.title}" to Cart!`,
      "success"
    );
  };

  // =========================
  // WISHLIST
  // =========================
  const handleWishlistToggle = () => {
    const added = toggleWishlist(product);

    if (added) {
      addToast(
        `Added "${product.title}" to Wishlist`,
        "info"
      );
    } else {
      addToast(
        `Removed "${product.title}" from Wishlist`,
        "info"
      );
    }
  };

  useEffect(() => {
  setSelectedImage(product?.image || "");
  setQuantity(1);
}, [id, product]);

  // =========================
  // FETCH REVIEWS
  // =========================
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);

        const data = await apiCall(`/products/${id}/reviews`);

        setReviewsList(data.reviews || []);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);

        setReviewsList([]);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [id]);

  const { user } = useAuth();

  const getCurrentUserId = () => {
    if (user?.id || user?._id) return String(user.id || user._id);
    let guestId = localStorage.getItem("guest_user_id");
    if (!guestId) {
      guestId = "guest_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
      localStorage.setItem("guest_user_id", guestId);
    }
    return guestId;
  };

  // =========================
  // SUBMIT REVIEW
  // =========================
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      addToast("Please write a review comment.", "error");
      return;
    }

    try {
      setSubmittingReview(true);
      const currentUserId = getCurrentUserId();
      const userName = user?.name || "Guest Customer";

      const data = await apiCall(`/products/${id}/reviews`, {
        method: "POST",
        body: JSON.stringify({
          rating: Number(newRating),
          comment: newComment.trim(),
          name: userName,
          userId: currentUserId,
        }),
        headers: {
          "x-user-id": currentUserId,
        },
      });

      const newRevObj = data.review || {
        _id: "rev_" + Date.now(),
        id: "rev_" + Date.now(),
        user: currentUserId,
        name: userName,
        rating: Number(newRating),
        comment: newComment.trim(),
        createdAt: new Date().toISOString(),
      };

      // Add new review immediately to UI
      setReviewsList((prev) => [
        newRevObj,
        ...prev,
      ]);

      // Clear form
      setNewComment("");
      setNewRating(5);

      addToast(
        "Review submitted successfully!",
        "success"
      );
    } catch (error) {
      console.error("Review submission failed:", error);

      addToast(
        error.message || "Failed to submit review",
        "error"
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  // =========================
  // DELETE REVIEW
  // =========================
  const handleDeleteReview = async (reviewId) => {
    const currentUserId = getCurrentUserId();
    try {
      await apiCall(`/products/${id}/reviews/${reviewId}`, {
        method: "DELETE",
        body: JSON.stringify({ userId: currentUserId }),
        headers: {
          "x-user-id": currentUserId,
        },
      });

      setReviewsList((prev) =>
        prev.filter((rev) => (rev._id || rev.id) !== reviewId)
      );

      addToast("Review deleted successfully!", "success");
    } catch (error) {
      console.error("Failed to delete review:", error);
      setReviewsList((prev) =>
        prev.filter((rev) => (rev._id || rev.id) !== reviewId)
      );
      addToast("Review deleted!", "success");
    }
  };

  // =========================
  // RELATED PRODUCTS
  // =========================
  const relatedProducts = products
    .filter(
      (p) =>
        p.category === product.category &&
        p.id !== product.id
    )
    .slice(0, 4);

  const originalPrice =
    product.originalPrice ||
    Math.round(product.price / 0.6);

  const discount =
    product.discount ||
    Math.round(
      ((originalPrice - product.price) /
        originalPrice) *
        100
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-2 mb-6"
      >
        <FaArrowLeft />
        Back to products
      </button>

      {/* =========================
          PRODUCT DETAILS
      ========================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* LEFT - IMAGES */}
        <div className="space-y-4">

          <div className="relative aspect-square bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 shadow-sm">

            <img
              src={selectedImage || product.image}
              alt={product.title}
              className="w-full h-full object-cover transition duration-300"
            />

            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                -{discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images &&
            product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">

                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      setSelectedImage(img)
                    }
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition ${
                      (selectedImage ||
                        product.image) === img
                        ? "border-blue-600 scale-95"
                        : "border-slate-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}

              </div>
            )}
        </div>

        {/* RIGHT - PRODUCT INFO */}
        <div className="flex flex-col justify-between space-y-6">

          <div>

            {/* Category + Stock */}
            <div className="flex items-center gap-2 mb-2">

              <span className="bg-blue-50 text-blue-700 text-xs font-extrabold uppercase px-3 py-1 rounded-full">
                {product.category}
              </span>

              <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full">
                ✔ In Stock ({product.stock || 12} items left)
              </span>

            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">

              <div className="flex text-amber-400 text-sm">

                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < Math.floor(product.rating)
                        ? "text-amber-400"
                        : "text-slate-200"
                    }
                  />
                ))}

              </div>

              <span className="text-sm font-bold text-slate-700">
                {product.rating}
              </span>

              <span className="text-xs text-slate-400">
                ({reviewsList.length} reviews)
              </span>

            </div>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">

              <span className="text-4xl font-black text-slate-900">
                ₹{product.price.toLocaleString("en-IN")}
              </span>

              <span className="text-lg text-slate-400 line-through">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>

              <span className="text-sm text-rose-500 font-bold">
                Save ₹
                {(originalPrice - product.price).toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

            {/* Description */}
            <p className="mt-6 text-slate-600 text-sm leading-relaxed">
              {product.description}
            </p>

          </div>

          {/* Quantity + Wishlist */}
          <div className="space-y-4 pt-6 border-t border-slate-100">

            <div className="flex items-center gap-4">

              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Quantity:
              </label>

              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">

                <button
                  onClick={() =>
                    setQuantity(
                      Math.max(1, quantity - 1)
                    )
                  }
                  className="w-10 h-10 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200"
                >
                  -
                </button>

                <span className="w-12 text-center font-bold text-slate-900">
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    setQuantity(quantity + 1)
                  }
                  className="w-10 h-10 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200"
                >
                  +
                </button>

              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2 text-base"
              >
                <FaShoppingCart />
                Add to Cart
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`p-4 rounded-2xl border-2 transition flex items-center justify-center gap-2 font-semibold text-sm ${
                  isLiked
                    ? "border-rose-500 bg-rose-50 text-rose-600"
                    : "border-slate-200 text-slate-700 hover:border-rose-500 hover:text-rose-500"
                }`}
              >
                {isLiked ? (
                  <FaHeart className="text-rose-500 text-lg" />
                ) : (
                  <FaRegHeart className="text-lg" />
                )}

                <span>
                  {isLiked
                    ? "Saved to Wishlist"
                    : "Add to Wishlist"}
                </span>
              </button>

            </div>

            {/* Value Props */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center text-xs text-slate-600">

              <div className="flex flex-col items-center gap-1">
                <FaTruck className="text-blue-500 text-lg" />
                <span className="font-semibold">
                  Free Express Shipping
                </span>
              </div>

              <div className="flex flex-col items-center gap-1 border-x border-slate-200 px-2">
                <FaSync className="text-emerald-500 text-lg" />
                <span className="font-semibold">
                  7 Days Easy Return
                </span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <FaShieldAlt className="text-amber-500 text-lg" />
                <span className="font-semibold">
                  1 Year Warranty
                </span>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* =========================
          REVIEWS
      ========================= */}
      <div className="border-t border-slate-200 pt-12 mb-16">

        <h2 className="text-2xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
          <FaComment className="text-blue-600" />
          Customer Ratings & Reviews
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* REVIEW FORM */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-fit">

            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Write a Review
            </h3>

            <form
              onSubmit={handleReviewSubmit}
              className="space-y-4"
            >

              {/* Rating */}
              <div>

                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Rating Stars
                </label>

                <select
                  value={newRating}
                  onChange={(e) =>
                    setNewRating(Number(e.target.value))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                >
                  <option value={5}>
                    ⭐⭐⭐⭐⭐ (5 - Excellent)
                  </option>

                  <option value={4}>
                    ⭐⭐⭐⭐ (4 - Good)
                  </option>

                  <option value={3}>
                    ⭐⭐⭐ (3 - Average)
                  </option>

                  <option value={2}>
                    ⭐⭐ (2 - Below Average)
                  </option>

                  <option value={1}>
                    ⭐ (1 - Poor)
                  </option>
                </select>

              </div>

              {/* Comment */}
              <div>

                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Review Comment
                </label>

                <textarea
                  rows="3"
                  required
                  placeholder="Share your experience with this product..."
                  value={newComment}
                  onChange={(e) =>
                    setNewComment(e.target.value)
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs"
                />

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submittingReview}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-xs transition"
              >
                {submittingReview
                  ? "Submitting..."
                  : "Submit Review"}
              </button>

            </form>

          </div>

          {/* REVIEW LIST */}
          <div className="lg:col-span-7 space-y-4">

            {loadingReviews ? (
              <p className="text-slate-400 text-sm">
                Loading reviews...
              </p>
            ) : reviewsList.length === 0 ? (
              <p className="text-slate-400 text-sm">
                No reviews yet. Be the first to leave a review!
              </p>
            ) : (
              reviewsList.map((rev) => {
                const currentUserId = getCurrentUserId();
                const revUserId = rev.user?._id || rev.user?.id || rev.user;
                const canDelete =
                  currentUserId &&
                  (String(revUserId) === String(currentUserId) ||
                    (user?.name && rev.name === user.name) ||
                    user?.role === "admin");

                return (
                  <div
                    key={rev._id || rev.id}
                    className="bg-slate-50 rounded-2xl p-5 border border-slate-100"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-slate-800 text-sm">
                        {rev.name || rev.user}
                      </span>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">
                          {rev.createdAt
                            ? new Date(
                                rev.createdAt
                              ).toLocaleDateString("en-IN")
                            : rev.date || "Just now"}
                        </span>

                        {canDelete && (
                          <button
                            onClick={() => handleDeleteReview(rev._id || rev.id)}
                            className="text-xs text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 transition px-2 py-0.5 rounded-md hover:bg-rose-100"
                            title="Delete your review"
                          >
                            <FaTrash className="text-xs" />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex text-amber-400 text-xs mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < Number(rev.rating)
                              ? "text-amber-400"
                              : "text-slate-300"
                          }
                        />
                      ))}
                    </div>

                    {/* Comment */}
                    <p className="text-slate-600 text-sm">
                      {rev.comment}
                    </p>
                  </div>
                );
              })
            )}

          </div>

        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-slate-200 pt-12">

          <h2 className="text-2xl font-extrabold text-slate-900 mb-8">
            You Might Also Like
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

            {relatedProducts.map((relProduct) => (
              <ProductCard
                key={relProduct.id}
                product={relProduct}
              />
            ))}

          </div>

        </div>
      )}

    </div>
  );
}

export default ProductDetails;