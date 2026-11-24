const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });
const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Review = require("../models/Review");
const Order = require("../models/Order");
const connectDB = require("../config/db");

const sampleCategories = [
  { name: "Shoes", description: "Sports, running, and casual footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" },
  { name: "Electronics", description: "Gadgets, audio gear, and wearables", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },
  { name: "Bags", description: "Travel, office, and casual backpacks", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500" },
  { name: "Clothing", description: "T-shirts, shirts, and casual wear", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500" },
  { name: "Accessories", description: "Sunglasses, watches, and accessories", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500" },
];

const sampleProducts = [
  {
    title: "Nike Air Max",
    price: 4999,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    category: "Shoes",
    brand: "Nike",
    rating: 4.8,
    numReviews: 12,
    countInStock: 15,
    description: "Experience superior comfort and style with the Nike Air Max. Designed for everyday wear with premium cushioning and a lightweight build.",
    isFeatured: true,
  },
  {
    title: "Apple Watch Series 9",
    price: 24999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    category: "Electronics",
    brand: "Apple",
    rating: 4.7,
    numReviews: 24,
    countInStock: 8,
    description: "Track your fitness, receive notifications, and stay connected with the latest Apple Watch featuring an Always-On Retina display.",
    isFeatured: true,
  },
  {
    title: "Wireless ANC Headphones",
    price: 7999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    category: "Electronics",
    brand: "Sony",
    rating: 4.6,
    numReviews: 18,
    countInStock: 20,
    description: "Premium wireless headphones with crystal-clear sound, active noise cancellation, and up to 30 hours battery life.",
    isFeatured: true,
  },
  {
    title: "Leather Urban Backpack",
    price: 3499,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    category: "Bags",
    brand: "Wildcraft",
    rating: 4.5,
    numReviews: 9,
    countInStock: 12,
    description: "Stylish leather backpack with spacious padded laptop compartment, perfect for work, college, or travel.",
    isFeatured: false,
  },
  {
    title: "Pro Running Shoes",
    price: 5999,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
    category: "Shoes",
    brand: "Adidas",
    rating: 4.7,
    numReviews: 15,
    countInStock: 6,
    description: "Lightweight running shoes with breathable mesh fabric, impact absorption, and high-traction grip for daily workouts.",
    isFeatured: false,
  },
  {
    title: "RGB Gaming Mouse",
    price: 2499,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500",
    category: "Electronics",
    brand: "Logitech",
    rating: 4.4,
    numReviews: 31,
    countInStock: 25,
    description: "High-precision gaming mouse with customizable RGB lighting, ergonomic grip, and 6 programmable macro buttons.",
    isFeatured: false,
  },
  {
    title: "Cotton Casual T-Shirt",
    price: 999,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    category: "Clothing",
    brand: "Puma",
    rating: 4.3,
    numReviews: 8,
    countInStock: 30,
    description: "Soft 100% organic cotton T-shirt designed for everyday comfort with a modern slim fit.",
    isFeatured: false,
  },
  {
    title: "UV Protection Sunglasses",
    price: 1999,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500",
    category: "Accessories",
    brand: "RayBan",
    rating: 4.5,
    numReviews: 14,
    countInStock: 18,
    description: "Stylish UV400 protected polarized sunglasses with a lightweight matte frame for everyday outdoor use.",
    isFeatured: true,
  },
];

const importData = async () => {
  try {
    await connectDB();

    console.log("Clearing existing database collections...");
    await Order.deleteMany();
    await Review.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log("Creating default admin and sample user...");
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
      phone: "+91 9876543210",
      address: {
        street: "123 Tech Avenue",
        city: "Bangalore",
        state: "Karnataka",
        postalCode: "560001",
        country: "India",
      },
    });

    const regularUser = await User.create({
      name: "Sample Customer",
      email: "user@example.com",
      password: "password123",
      role: "user",
      phone: "+91 9876500000",
      address: {
        street: "45 MG Road",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400001",
        country: "India",
      },
    });

    console.log("Seeding categories...");
    await Category.insertMany(sampleCategories);

    console.log("Seeding products...");
    const sampleProductsWithAdmin = sampleProducts.map((p) => ({
      ...p,
      user: adminUser._id,
    }));

    await Product.insertMany(sampleProductsWithAdmin);

    console.log("Database seeded successfully!");
    console.log("-----------------------------------------");
    console.log("Admin Account  : admin@example.com / password123");
    console.log("User Account   : user@example.com / password123");
    console.log("-----------------------------------------");
    process.exit(0);
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Order.deleteMany();
    await Review.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed!");
    process.exit(0);
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
