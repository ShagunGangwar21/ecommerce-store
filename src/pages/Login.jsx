import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { FaUser, FaLock, FaEnvelope, FaUserShield, FaArrowRight } from "react-icons/fa";

function Login() {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [errorMsg, setErrorMsg] = useState("");

  const { login, register, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please enter email and password.");
      return;
    }

    if (isLoginTab) {
      const res = await login(email, password);
      if (res.success) {
        addToast(`Welcome back, ${res.user.name || "User"}!`, "success");
        navigate(redirectPath);
      } else {
        setErrorMsg("Failed to sign in. Please check credentials.");
      }
    } else {
      if (!name) {
        setErrorMsg("Please enter your full name.");
        return;
      }
      const res = await register(name, email, password, role);
      if (res.success) {
        addToast("Account created successfully!", "success");
        navigate(redirectPath);
      } else {
        setErrorMsg("Registration failed. Try again.");
      }
    }
  };

  const handleDemoUserLogin = async () => {
    const res = await login("customer@shopeasy.com", "password123");
    if (res.success) {
      addToast("Logged in as Demo Customer!", "success");
      navigate(redirectPath);
    }
  };

  const handleDemoAdminLogin = async () => {
    const res = await login("admin@shopeasy.com", "admin123");
    if (res.success) {
      addToast("Logged in as Demo Administrator!", "info");
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center text-white relative">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
            <FaUser className="text-2xl text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {isLoginTab ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            {isLoginTab
              ? "Sign in to access your orders, wishlist & rewards"
              : "Join ShopEasy today for exclusive deals"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          <button
            onClick={() => {
              setIsLoginTab(true);
              setErrorMsg("");
            }}
            className={`flex-1 py-3 text-sm font-semibold transition ${
              isLoginTab
                ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsLoginTab(false);
              setErrorMsg("");
            }}
            className={`flex-1 py-3 text-sm font-semibold transition ${
              !isLoginTab
                ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8">
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-semibold text-center border border-rose-100">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginTab && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>
            </div>

            {!isLoginTab && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Account Type
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="user">Customer Account</option>
                  <option value="admin">Administrator Account</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 mt-6"
            >
              <span>{loading ? "Processing..." : isLoginTab ? "Sign In" : "Create Account"}</span>
              <FaArrowRight className="text-xs" />
            </button>
          </form>

          {/* Quick Demo Logins Section */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              ⚡ Quick Demo Testing
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleDemoUserLogin}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
              >
                <FaUser className="text-blue-500" />
                <span>Demo User</span>
              </button>
              <button
                type="button"
                onClick={handleDemoAdminLogin}
                className="bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition border border-amber-200/50"
              >
                <FaUserShield className="text-amber-600" />
                <span>Demo Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;