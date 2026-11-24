import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingBag, FaArrowRight, FaShieldAlt, FaTruck, FaHeadset } from "react-icons/fa";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white py-20 lg:py-24">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold px-4 py-2 rounded-full backdrop-blur-md">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
              <span>NEW SEASON 2026 COLLECTION</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              Discover Next-Gen <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Shopping</span> Experience
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Explore curated premium sneakers, smart electronics, stylish apparel, and luxury accessories with free express delivery and easy returns.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <Link
                to="/products"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2 text-base"
              >
                <FaShoppingBag />
                <span>Shop Catalog Now</span>
              </Link>
              <Link
                to="/wishlist"
                className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold py-4 px-8 rounded-2xl transition flex items-center justify-center gap-2 text-base"
              >
                <span>View Saved Items</span>
                <FaArrowRight className="text-xs" />
              </Link>
            </div>

            {/* Feature Metrics Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800 text-slate-400 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <FaTruck className="text-blue-400 text-lg shrink-0" />
                <span>Free Express Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-emerald-400 text-lg shrink-0" />
                <span>100% Authentic Products</span>
              </div>
              <div className="flex items-center gap-2">
                <FaHeadset className="text-purple-400 text-lg shrink-0" />
                <span>24/7 Priority Support</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Image Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 group">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"
                alt="Nike Air Max Hero"
                className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400">
                  Featured Highlight
                </span>
                <h3 className="font-bold text-lg">Nike Air Max 270</h3>
                <p className="text-xs text-slate-200 mt-1">₹4,999 • 44% Discount Today</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;