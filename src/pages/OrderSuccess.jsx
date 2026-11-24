import React from "react";
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import { FaCheckCircle, FaBoxOpen, FaTruck, FaHome, FaReceipt } from "react-icons/fa";

function OrderSuccess() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order || {
    id: id || "ORD-892104",
    date: new Date().toLocaleDateString("en-IN"),
    grandTotal: 12499,
    status: "Processing",
    paymentMethod: "CARD",
    items: [],
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      {/* Animated Checkmark Circle */}
      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl shadow-xl shadow-emerald-500/20 animate-bounce-short">
        <FaCheckCircle />
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
        Thank You for Your Order!
      </h1>
      <p className="text-slate-500 text-base max-w-md mx-auto mb-6">
        Your order <span className="font-mono font-bold text-slate-800">#{order.id}</span> has been confirmed and is being processed by our team.
      </p>

      {/* Order Info Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-left mb-8 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs text-slate-400 font-medium">Order Reference</span>
            <p className="font-bold text-slate-800 font-mono text-sm">#{order.id}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium">Payment Mode</span>
            <p className="font-bold text-slate-800 text-sm">{order.paymentMethod}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium">Total Amount</span>
            <p className="font-bold text-blue-600 text-sm">
              ₹{(order.grandTotal || 0).toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Delivery Progress Bar */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
            <FaTruck className="text-blue-500" /> Estimated Delivery: 3-5 Business Days
          </h4>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
            <div className="bg-emerald-500 w-1/3 h-full rounded-full"></div>
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-2">
            <span className="text-emerald-600 font-bold">Order Confirmed</span>
            <span>Shipped</span>
            <span>Out for Delivery</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/orders"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-2xl shadow-lg shadow-blue-600/30 transition"
        >
          <FaBoxOpen />
          <span>View Order History</span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-8 py-3.5 rounded-2xl transition"
        >
          <FaHome />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccess;
