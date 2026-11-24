import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useNavigate, Link } from "react-router-dom";
import {
  FaTrash,
  FaShoppingCart,
  FaArrowLeft,
  FaTicketAlt,
  FaArrowRight,
  FaShieldAlt,
} from "react-icons/fa";

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    deliveryCharge,
    grandTotal,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
  } = useContext(CartContext);

  const { addToast } = useToast();
  const navigate = useNavigate();

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError("");
    const res = applyPromoCode(promoInput);
    if (res.success) {
      addToast(`Coupon code applied! Saved ${res.discountPercent}%`, "success");
      setPromoInput("");
    } else {
      setPromoError(res.message);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
          <FaShoppingCart />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-slate-500 text-base max-w-md mx-auto mb-8">
          Explore our trending sneakers, electronics, and fashion items to fill your cart.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-2xl shadow-lg shadow-blue-600/30 transition"
        >
          <FaArrowLeft className="text-xs" />
          <span>Explore Shop</span>
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
            <FaShoppingCart className="text-blue-600" />
            <span>Shopping Cart</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {cartItems.length} product line item(s) selected
          </p>
        </div>
        <button
          onClick={() => navigate("/products")}
          className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1.5"
        >
          <FaArrowLeft className="text-xs" />
          <span>Continue Shopping</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Item Cards Column */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row items-center gap-6 relative"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-28 h-28 object-cover rounded-2xl border border-slate-100"
              />

              <div className="flex-1 w-full text-center sm:text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                  {item.category}
                </span>
                <Link to={`/product/${item.id}`}>
                  <h3 className="font-bold text-slate-900 text-lg hover:text-blue-600 transition mt-1">
                    {item.title}
                  </h3>
                </Link>

                <div className="mt-2 flex items-center justify-center sm:justify-start gap-3">
                  <span className="text-xl font-extrabold text-slate-900">
                    ₹{item.price.toLocaleString("en-IN")}
                  </span>
                  {item.originalPrice && (
                    <span className="text-xs text-slate-400 line-through">
                      ₹{item.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-slate-900 text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-sm font-extrabold text-slate-800">
                    Total: ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => {
                  removeFromCart(item.id);
                  addToast(`Removed "${item.title}"`, "info");
                }}
                className="sm:self-start text-slate-400 hover:text-rose-500 p-2 rounded-xl hover:bg-rose-50 transition"
                title="Remove item"
              >
                <FaTrash className="text-sm" />
              </button>
            </div>
          ))}
        </div>

        {/* Right Summary Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm sticky top-24 space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h2>

            {/* Promo Code Entry */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1.5">
                <FaTicketAlt className="text-blue-500" /> Have a Coupon Code?
              </label>
              {appliedPromo ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-700 px-3.5 py-2.5 rounded-xl text-xs font-bold">
                  <span>Code '{appliedPromo.code}' Applied ({appliedPromo.discountPercent * 100}% OFF)</span>
                  <button onClick={removePromoCode} className="text-rose-500 underline text-[11px]">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Try 'OFF10' or 'DISCOUNT20'"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-slate-900 text-white font-semibold text-xs px-4 py-2 rounded-xl hover:bg-slate-800 transition"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoError && <p className="text-[11px] text-rose-500 mt-1">{promoError}</p>}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-3 text-sm text-slate-600 border-t border-slate-100 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Promo Discount</span>
                  <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `₹${deliveryCharge}`
                  )}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-between text-2xl font-black text-slate-900">
                <span>Total</span>
                <span className="text-blue-600">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2 text-base"
            >
              <span>Proceed to Checkout</span>
              <FaArrowRight />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <FaShieldAlt className="text-emerald-500" />
              <span>Safe & Express Delivery Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;