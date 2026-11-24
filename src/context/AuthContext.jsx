import React, { createContext, useState, useEffect, useContext } from "react";
import { apiCall } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await apiCall("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const userData = {
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        address: data.address,
      };

      setUser(userData);
      setToken(data.token);
      setLoading(false);
      return { success: true, user: userData };
    } catch (error) {
      setLoading(false);
      const errorMsg = error.message || "";

      // Handling Network / Server unreachable error
      if (errorMsg === "Failed to fetch") {
        alert("Server is not reachable! Please start your backend server (npm start).");
        return { success: false, message: errorMsg };
      }

      // POPUP: If user is not registered / credentials invalid
      if (
        errorMsg.toLowerCase().includes("not found") ||
        errorMsg.toLowerCase().includes("invalid email") ||
        errorMsg.toLowerCase().includes("invalid credentials") ||
        errorMsg.toLowerCase().includes("user does not exist")
      ) {
        alert("Account not registered! Please register first before logging in.");
      } else {
        alert(errorMsg || "Login failed! Please try again.");
      }

      return { success: false, message: error.message };
    }
  };

  const register = async (name, email, password, role = "user") => {
    setLoading(true);
    try {
      const data = await apiCall("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, role }),
      });

      const userData = {
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      setUser(userData);
      setToken(data.token);
      setLoading(false);
      return { success: true, user: userData };
    } catch (error) {
      setLoading(false);

      if (error.message === "Failed to fetch") {
        alert("Server is not reachable! Please start your backend server (npm start).");
      } else {
        alert(error.message || "Registration failed!");
      }

      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateProfile = async (updatedData) => {
    setLoading(true);
    try {
      const data = await apiCall("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(updatedData),
      });

      const newUserData = {
        id: data._id || user.id,
        name: data.name || updatedData.name || user.name,
        email: data.email || updatedData.email || user.email,
        phone: data.phone || updatedData.phone || user.phone,
        role: data.role || user.role,
        address: data.address || updatedData.address || user.address,
      };

      setUser(newUserData);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, message: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { AuthContext };