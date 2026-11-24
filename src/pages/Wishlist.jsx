import React, { useContext } from "react";
import { useWishlist } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaTrash, FaShoppingCart, FaArrowLeft, FaStar } from "react-icons/fa";

function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useContext(CartContext);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
    addToast(`Moved "${product.title}" to Shopping Cart!`, "success");
  };

  const handleRemove = (product) => {
    removeFromWishlist(product.id);
    addToast(`Removed "${product.title}" from Wishlist`, "info");
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500 text-4xl shadow-inner">
          <FaHeart />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
          Your Wishlist is Empty
        </h1>
        <p className="text-slate-500 text-base max-w-md mx-auto mb-8">
          Save your favorite sneakers, electronics, and apparel here by clicking the heart icon on any product.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-2xl shadow-lg shadow-blue-600/30 transition"
        >
          <FaArrowLeft className="text-xs" />
          <span>Explore Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <FaHeart className="text-rose-500" />
            <span>My Wishlist</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {wishlistItems.length} saved item(s) in your personal collection
          </p>
        </div>
        <button
          onClick={() => navigate("/products")}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
        >
          <FaArrowLeft className="text-xs" />
          <span>Continue Browsing</span>
        </button>
      </div>

      {/* Grid of Wishlist Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
          >
            <div className="relative aspect-square bg-slate-50 overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Remove icon overlay */}
              <button
                onClick={() => handleRemove(product)}
                className="absolute top-3 right-3 bg-white/90 hover:bg-rose-500 hover:text-white text-slate-600 p-2.5 rounded-full shadow-md transition"
                title="Remove from wishlist"
              >
                <FaTrash className="text-xs" />
              </button>

              {product.discount && (
                <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  -{product.discount}% OFF
                </span>
              )}
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-semibold text-blue-600 uppercase">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 font-medium">
                    <FaStar className="text-xs" />
                    <span>{product.rating}</span>
                  </div>
                </div>

                <Link to={`/product/${product.id}`}>
                  <h3 className="font-semibold text-slate-800 line-clamp-1 hover:text-blue-600 transition">
                    {product.title}
                  </h3>
                </Link>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-slate-900">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-slate-400 line-through">
                      ₹{product.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <button
                  onClick={() => handleMoveToCart(product)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-md shadow-blue-600/20"
                >
                  <FaShoppingCart className="text-xs" />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
