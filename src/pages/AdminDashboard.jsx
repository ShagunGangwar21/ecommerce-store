import React, { useState } from "react";
import initialProducts from "../data/Products";
import { useToast } from "../context/ToastContext";
import {
  FaShieldAlt,
  FaBox,
  FaMoneyBillWave,
  FaUsers,
  FaPlus,
  FaTrash,
  FaEdit,
  FaCheckCircle,
} from "react-icons/fa";

function AdminDashboard() {
  const { addToast } = useToast();
  const [productsList, setProductsList] = useState(initialProducts);

  const [ordersList, setOrdersList] = useState(() => {
    return JSON.parse(localStorage.getItem("orders") || "[]");
  });

  const [activeTab, setActiveTab] = useState("products"); // 'products' or 'orders'
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    stock: 10,
    description: "",
  });

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price) {
      addToast("Please fill in title and price", "error");
      return;
    }

    const created = {
      id: Date.now(),
      title: newProduct.title,
      price: Number(newProduct.price),
      originalPrice: Math.round(Number(newProduct.price) * 1.4),
      discount: 28,
      category: newProduct.category,
      image: newProduct.image,
      stock: Number(newProduct.stock),
      rating: 5.0,
      description: newProduct.description || "Newly added store item.",
    };

    setProductsList([created, ...productsList]);
    setShowAddModal(false);
    setNewProduct({
      title: "",
      price: "",
      category: "Shoes",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
      stock: 10,
      description: "",
    });
    addToast(`Product "${created.title}" added successfully!`, "success");
  };

  const handleDeleteProduct = (id, title) => {
    setProductsList(productsList.filter((p) => p.id !== id));
    addToast(`Deleted "${title}"`, "info");
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updated = ordersList.map((ord) =>
      ord.id === orderId ? { ...ord, status: newStatus } : ord
    );
    setOrdersList(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
    addToast(`Updated order #${orderId} status to "${newStatus}"`, "success");
  };

  const totalRevenue = ordersList.reduce((sum, ord) => sum + (ord.grandTotal || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <FaShieldAlt className="text-amber-500" /> Admin Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Store overview, product catalog management, and customer order processing
          </p>
        </div>
        {activeTab === "products" && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 px-5 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30 transition"
          >
            <FaPlus /> Add Product
          </button>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl">
            <FaMoneyBillWave />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Total Revenue</span>
            <h3 className="text-2xl font-black text-slate-900">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl">
            <FaBox />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Total Products</span>
            <h3 className="text-2xl font-black text-slate-900">{productsList.length}</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-2xl">
            <FaCheckCircle />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Orders Placed</span>
            <h3 className="text-2xl font-black text-slate-900">{ordersList.length}</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-2xl">
            <FaUsers />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Registered Users</span>
            <h3 className="text-2xl font-black text-slate-900">12</h3>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab("products")}
          className={`py-3 px-6 text-sm font-bold transition border-b-2 ${
            activeTab === "products"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Products Catalog ({productsList.length})
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`py-3 px-6 text-sm font-bold transition border-b-2 ${
            activeTab === "orders"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Customer Orders ({ordersList.length})
        </button>
      </div>

      {/* Products Table View */}
      {activeTab === "products" && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
                  <th className="p-4">Item</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium">
                {productsList.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded-xl border border-slate-100"
                      />
                      <span className="font-bold text-slate-800">{product.title}</span>
                    </td>
                    <td className="p-4 text-slate-600">{product.category}</td>
                    <td className="p-4 font-bold text-slate-900">
                      ₹{product.price.toLocaleString("en-IN")}
                    </td>
                    <td className="p-4">
                      <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold">
                        {product.stock || 15} in stock
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteProduct(product.id, product.title)}
                        className="text-rose-500 hover:text-rose-700 p-2 rounded-lg hover:bg-rose-50 transition"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Table View */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {ordersList.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              No orders placed yet in memory.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="p-4">Order Reference</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium">
                  {ordersList.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-mono font-bold text-slate-800">#{ord.id}</td>
                      <td className="p-4">
                        {ord.shippingAddress?.fullName || "Guest User"}
                      </td>
                      <td className="p-4 font-bold text-blue-600">
                        ₹{(ord.grandTotal || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            ord.status === "Delivered"
                              ? "bg-emerald-50 text-emerald-700"
                              : ord.status === "Shipped"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {ord.status || "Processing"}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={ord.status || "Processing"}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              Add New Product to Store
            </h3>

            <form onSubmit={handleAddProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sony Wireless Earbuds"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="2999"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm"
                  >
                    <option value="Shoes">Shoes</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Bags">Bags</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition shadow-md shadow-blue-600/20"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
