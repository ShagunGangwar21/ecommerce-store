import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaTruck, FaCheckCircle, FaClock, FaArrowLeft } from "react-icons/fa";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders);
  }, []);

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          <FaBoxOpen />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">No Orders Placed Yet</h1>
        <p className="text-slate-500 text-base max-w-md mx-auto mb-8">
          When you purchase products from ShopEasy, your order history and tracking statuses will appear here.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-2xl shadow-lg shadow-blue-600/30 transition"
        >
          <FaArrowLeft className="text-xs" />
          <span>Start Shopping</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <FaBoxOpen className="text-blue-600" />
            <span>My Orders</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track and manage your past order purchases ({orders.length} order(s))
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 hover:shadow-md transition"
          >
            {/* Top Info Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">Order ID</span>
                <p className="font-mono font-bold text-slate-800 text-sm">#{order.id}</p>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">Date</span>
                <p className="font-semibold text-slate-800 text-sm">{order.date}</p>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">Total Amount</span>
                <p className="font-bold text-blue-600 text-sm">
                  ₹{(order.grandTotal || 0).toLocaleString("en-IN")}
                </p>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">Status</span>
                <div className="mt-0.5">
                  {order.status === "Delivered" ? (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
                      <FaCheckCircle /> Delivered
                    </span>
                  ) : order.status === "Shipped" ? (
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-1 rounded-full">
                      <FaTruck /> Shipped
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full">
                      <FaClock /> Processing
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items Grid */}
            <div className="py-4 space-y-3">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded-xl border border-slate-100"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                      <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-700">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            {/* Shipping Summary */}
            {order.shippingAddress && (
              <div className="bg-slate-50 p-3 rounded-2xl text-xs text-slate-600 flex flex-wrap justify-between items-center gap-2">
                <span>
                  <strong>Deliver to:</strong> {order.shippingAddress.fullName},{" "}
                  {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode}
                </span>
                <span className="text-[11px] bg-white border border-slate-200 px-2.5 py-1 rounded-lg font-semibold">
                  Payment: {order.paymentMethod}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
