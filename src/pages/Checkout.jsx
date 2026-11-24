import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import {
  FaCreditCard,
  FaMoneyBillWave,
  FaMobileAlt,
  FaLock,
  FaShieldAlt,
  FaCheckCircle,
  FaArrowLeft,
  FaTicketAlt,
} from "react-icons/fa";

function Checkout() {
  const {
    cartItems,
    subtotal,
    discountAmount,
    deliveryCharge,
    grandTotal,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    clearCart,
  } = useContext(CartContext);

  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Shipping Form State
  const [shippingData, setShippingData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "9876543210",
    street: user?.address?.street || "12 Sector 4",
    city: user?.address?.city || "Mumbai",
    state: user?.address?.state || "Maharashtra",
    postalCode: user?.address?.postalCode || "400001",
  });

  const handleInputChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError("");
    const res = applyPromoCode(promoInput);
    if (res.success) {
      addToast(`Promo code applied! Saved ${res.discountPercent}%`, "success");
      setPromoInput("");
    } else {
      setPromoError(res.message);
    }
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      addToast("Your cart is empty", "error");
      return;
    }

    const newOrder = {
      id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      items: [...cartItems],
      shippingAddress: shippingData,
      paymentMethod: paymentMethod.toUpperCase(),
      subtotal,
      discountAmount,
      deliveryCharge,
      grandTotal,
      status: "Processing",
    };

    // Save order in localStorage orders history
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem("orders", JSON.stringify([newOrder, ...existingOrders]));

    clearCart();
    addToast("Order placed successfully!", "success");
    navigate(`/order-success/${newOrder.id}`, { state: { order: newOrder } });
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">No items to checkout</h2>
        <button
          onClick={() => navigate("/products")}
          className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate("/cart")}
          className="text-sm font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-2"
        >
          <FaArrowLeft className="text-xs" /> Back to Cart
        </button>
        <h1 className="text-3xl font-extrabold text-slate-900">Secure Checkout</h1>
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <FaShieldAlt /> 256-Bit SSL Encryption
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Column */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-8">
          {/* Shipping Address Section */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                1
              </span>
              Shipping Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={shippingData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={shippingData.email}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={shippingData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  value={shippingData.street}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={shippingData.city}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  State & Postal Code
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="state"
                    required
                    value={shippingData.state}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm"
                  />
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={shippingData.postalCode}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                2
              </span>
              Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <label
                className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition ${
                  paymentMethod === "card"
                    ? "border-blue-600 bg-blue-50/40 text-blue-700 font-bold"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="sr-only"
                />
                <FaCreditCard className="text-2xl mb-1 text-blue-600" />
                <span className="text-xs">Credit / Debit</span>
              </label>

              <label
                className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition ${
                  paymentMethod === "upi"
                    ? "border-blue-600 bg-blue-50/40 text-blue-700 font-bold"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === "upi"}
                  onChange={() => setPaymentMethod("upi")}
                  className="sr-only"
                />
                <FaMobileAlt className="text-2xl mb-1 text-emerald-600" />
                <span className="text-xs">UPI / GPay / QR</span>
              </label>

              <label
                className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition ${
                  paymentMethod === "cod"
                    ? "border-blue-600 bg-blue-50/40 text-blue-700 font-bold"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="sr-only"
                />
                <FaMoneyBillWave className="text-2xl mb-1 text-amber-600" />
                <span className="text-xs">Cash on Delivery</span>
              </label>
            </div>

            {paymentMethod === "card" && (
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <input
                  type="text"
                  placeholder="Card Number (4000 1234 5678 9010)"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm"
                  defaultValue="4532 8912 3456 7890"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM / YY"
                    className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm"
                    defaultValue="12/28"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm"
                    defaultValue="888"
                  />
                </div>
              </div>
            )}

            {paymentMethod === "upi" && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <p className="text-xs font-semibold text-slate-700 mb-2">
                  Enter your UPI ID (e.g. user@okaxis or user@ybl)
                </p>
                <input
                  type="text"
                  placeholder="user@upi"
                  defaultValue="shajun@okaxis"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-center font-mono"
                />
              </div>
            )}

            {paymentMethod === "cod" && (
              <div className="bg-amber-50 text-amber-800 text-xs font-medium p-4 rounded-xl border border-amber-200">
                Pay with Cash or UPI upon package delivery at your doorstep.
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 text-base mt-6"
            >
              <FaLock className="text-sm" />
              <span>Place Order • ₹{grandTotal.toLocaleString("en-IN")}</span>
            </button>
          </div>
        </form>

        {/* Right Summary Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
              Order Summary ({cartItems.length} items)
            </h2>

            {/* Cart Items Mini List */}
            <div className="max-h-64 overflow-y-auto space-y-3 pr-1 mb-6 divide-y divide-slate-50">
              {cartItems.map((item) => (
                <div key={item.id} className="pt-3 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-14 h-14 object-cover rounded-xl border border-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{item.title}</p>
                    <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="mb-6 pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                <FaTicketAlt className="text-blue-500" /> Promo / Coupon Code
              </label>
              {appliedPromo ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2 rounded-xl text-xs font-bold">
                  <span>Applied: {appliedPromo.code} ({appliedPromo.discountPercent * 100}% OFF)</span>
                  <button onClick={removePromoCode} className="text-rose-500 underline text-[10px]">
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
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
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

            {/* Cost Summary Breakdown */}
            <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery / Shipping</span>
                <span>
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `₹${deliveryCharge}`
                  )}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-extrabold text-slate-900">
                <span>Grand Total</span>
                <span className="text-blue-600">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
