import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaPaperPlane,
  FaShieldAlt,
  FaCreditCard,
} from "react-icons/fa";

function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      addToast("Thank you for subscribing to ShopEasy Newsletter!", "success");
      setNewsletterEmail("");
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 mt-20 pt-16 pb-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="bg-blue-600 text-white font-extrabold text-2xl px-3 py-1 rounded-xl shadow-md">
                S
              </span>
              <span className="text-2xl font-black text-white tracking-tight">
                Shop<span className="text-blue-500">Easy</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Your premier online destination for high quality sneakers, electronics, fashion, and everyday essentials with 100% money-back guarantee.
            </p>

            {/* Newsletter Box */}
            <div className="pt-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-2">
                Subscribe for Exclusive Deals
              </span>
              <form onSubmit={handleSubscribe} className="flex max-w-sm">
                <input
                  type="email"
                  required
                  placeholder="Enter your email..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-white text-xs rounded-l-xl px-3.5 py-2.5 flex-1 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-r-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <FaPaperPlane />
                  <span>Join</span>
                </button>
              </form>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Explore Store
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-slate-400">
              <li>
                <Link to="/" className="hover:text-blue-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-blue-400 transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-blue-400 transition">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-blue-400 transition">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Account */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Customer Account
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-slate-400">
              <li>
                <Link to="/login" className="hover:text-blue-400 transition">
                  Sign In / Register
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-blue-400 transition">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-blue-400 transition">
                  Account Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Customer Care & Social */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Customer Care
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Need assistance? Our support team is online 24/7.
            </p>
            <div className="flex gap-3 text-slate-400 text-sm">
              <a
                href="#"
                className="w-9 h-9 bg-slate-900 hover:bg-blue-600 hover:text-white rounded-full flex items-center justify-center transition"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-slate-900 hover:bg-rose-600 hover:text-white rounded-full flex items-center justify-center transition"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-slate-900 hover:bg-sky-500 hover:text-white rounded-full flex items-center justify-center transition"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-slate-900 hover:bg-blue-700 hover:text-white rounded-full flex items-center justify-center transition"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 ShopEasy Inc. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <FaShieldAlt className="text-emerald-500" /> Safe SSL Payments
            </span>
            <div className="flex gap-2 text-base">
              <FaCreditCard />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;