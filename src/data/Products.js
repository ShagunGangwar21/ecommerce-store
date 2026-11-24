const products = [
  {
    id: 1,
    title: "Nike Air Max 270",
    price: 4999,
    originalPrice: 8999,
    discount: 44,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600"
    ],
    category: "Shoes",
    rating: 4.8,
    reviewsCount: 124,
    stock: 15,
    featured: true,
    description: "Experience superior comfort and style with the Nike Air Max 270. Designed for everyday wear with premium Air cushioning, breathable mesh upper, and a durable rubber outsole.",
    reviews: [
      { id: 1, user: "Alex Johnson", rating: 5, date: "2026-07-20", comment: "Extremely comfortable and stylish! Best sneakers I've owned." },
      { id: 2, user: "Priya Sharma", rating: 4, date: "2026-07-15", comment: "Great fit and cushion, slightly snug around the toe area." }
    ]
  },
  {
    id: 2,
    title: "Apple Watch Series 9",
    price: 24999,
    originalPrice: 34999,
    discount: 28,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600"
    ],
    category: "Electronics",
    rating: 4.9,
    reviewsCount: 230,
    stock: 8,
    featured: true,
    description: "Track your fitness, receive notifications, monitor heart rate, and stay seamlessly connected with the latest Apple Watch Series 9 with Always-On Retina display.",
    reviews: [
      { id: 1, user: "Rahul Verma", rating: 5, date: "2026-07-28", comment: "Awesome smart watch! The health tracking is remarkably accurate." }
    ]
  },
  {
    id: 3,
    title: "Sony WH-1000XM5 Wireless Headphones",
    price: 7999,
    originalPrice: 12999,
    discount: 38,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600"
    ],
    category: "Electronics",
    rating: 4.7,
    reviewsCount: 189,
    stock: 12,
    featured: true,
    description: "Industry-leading wireless noise-canceling headphones with crystal-clear sound quality, 30-hour battery life, and ultra-comfortable soft leather earpads.",
    reviews: [
      { id: 1, user: "David Miller", rating: 5, date: "2026-07-22", comment: "The noise cancellation is magic on flights and study sessions!" }
    ]
  },
  {
    id: 4,
    title: "Premium Heritage Leather Backpack",
    price: 3499,
    originalPrice: 5999,
    discount: 41,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600"
    ],
    category: "Bags",
    rating: 4.6,
    reviewsCount: 87,
    stock: 20,
    featured: false,
    description: "Handcrafted full-grain leather backpack with dedicated 15.6-inch laptop compartment, water-resistant lining, and ergonomic padded shoulder straps.",
    reviews: [
      { id: 1, user: "Suresh K.", rating: 5, date: "2026-06-18", comment: "Very high quality leather. Holds my laptop and daily essentials comfortably." }
    ]
  },
  {
    id: 5,
    title: "Adidas Ultraboost Light Running Shoes",
    price: 5999,
    originalPrice: 9999,
    discount: 40,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600"
    ],
    category: "Shoes",
    rating: 4.7,
    reviewsCount: 145,
    stock: 10,
    featured: true,
    description: "Lightweight high-performance running shoes featuring responsive Boost midsole technology and Continental Rubber outsole for maximum energy return.",
    reviews: []
  },
  {
    id: 6,
    title: "Logitech G Pro Wireless Gaming Mouse",
    price: 2499,
    originalPrice: 4499,
    discount: 44,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600",
    images: [
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600"
    ],
    category: "Electronics",
    rating: 4.5,
    reviewsCount: 94,
    stock: 25,
    featured: false,
    description: "Ultra-lightweight HERO 25K sensor gaming mouse designed for esports professionals with sub-1ms LIGHTSPEED wireless response and customizable RGB lighting.",
    reviews: []
  },
  {
    id: 7,
    title: "Urban Minimalist Cotton T-Shirt",
    price: 999,
    originalPrice: 1999,
    discount: 50,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"
    ],
    category: "Clothing",
    rating: 4.4,
    reviewsCount: 62,
    stock: 30,
    featured: false,
    description: "100% Organic combed cotton T-shirt engineered for ultra-soft breathable comfort, minimal shrink technology, and a modern relaxed fit.",
    reviews: []
  },
  {
    id: 8,
    title: "Ray-Ban Polarized Aviator Sunglasses",
    price: 1999,
    originalPrice: 3999,
    discount: 50,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600"
    ],
    category: "Accessories",
    rating: 4.6,
    reviewsCount: 78,
    stock: 18,
    featured: true,
    description: "Iconic classic metal frame aviator sunglasses featuring 100% UV400 polarized glass lenses for maximum clarity and eye protection.",
    reviews: []
  }
];

export default products;