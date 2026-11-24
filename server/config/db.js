const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;
  const fallbackUri = process.env.FALLBACK_MONGODB_URI || "mongodb://127.0.0.1:27017/ecommerce-store";

  try {
    if (!primaryUri) {
      throw new Error("MONGODB_URI environment variable is missing");
    }
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected (Primary): ${conn.connection.host}`);
  } catch (primaryError) {
    console.warn(`Primary MongoDB Connection failed (${primaryError.message}). Trying fallback...`);
    try {
      const conn = await mongoose.connect(fallbackUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`MongoDB Connected (Fallback): ${conn.connection.host}`);
    } catch (fallbackError) {
      console.error(`Database connection failed: ${fallbackError.message}`);
      console.warn("Please verify your MONGODB_URI in server/.env or ensure your local MongoDB service / network connection is active.");
    }
  }
};

module.exports = connectDB;
