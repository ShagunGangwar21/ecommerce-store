import React from "react";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaStar, FaShoppingCart } from "react-icons/fa";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();

  const isLiked = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    addToast(`Added "${product.title}" to cart!`, "success");
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product);
    if (added) {
      addToast(`Saved "${product.title}" to Wishlist`, "info");
    } else {
      addToast(`Removed "${product.title}" from Wishlist`, "info");
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between relative">
      {/* Top Badges & Image Container */}
      <div className="relative overflow-hidden bg-slate-50 aspect-square">
        {/* Discount Badge */}
        {product.discount > 0 && (
          <span className="absolute top-3 left-3 z-10 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            -{product.discount}% OFF
          </span>
        )}

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-md ${
            isLiked
              ? "bg-rose-500 text-white scale-110"
              : "bg-white/80 text-slate-600 hover:bg-white hover:text-rose-500 hover:scale-110"
          }`}
          title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          {isLiked ? <FaHeart className="text-sm" /> : <FaRegHeart className="text-sm" />}
        </button>

        {/* Product Image with Hover Zoom */}
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-blue-600">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-medium">
              <FaStar className="text-xs" />
              <span>{product.rating || 4.5}</span>
            </div>
          </div>

          <Link to={`/product/${product.id}`}>
            <h3 className="text-base font-semibold text-slate-800 line-clamp-1 hover:text-blue-600 transition">
              {product.title}
            </h3>
          </Link>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-bold text-slate-900">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-slate-400 line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-blue-600/20"
          >
            <FaShoppingCart className="text-sm" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;