import React, { useState, useMemo } from "react";
import ProductCard from "../components/Productcard";
import initialProducts from "../data/Products";
import { FaFilter, FaSearch, FaRedo } from "react-icons/fa";

function ProductsPage({
  searchTerm: globalSearchTerm = "",
  selectedCategory: globalCategory = "All",
  sortBy: globalSortBy = "",
}) {
  const [searchTerm, setSearchTerm] = useState(globalSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState(globalCategory);
  const [maxPrice, setMaxPrice] = useState(30000);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState(globalSortBy);

  const categories = ["All", "Shoes", "Clothing", "Electronics", "Bags", "Accessories"];

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        const matchesCategory =
          selectedCategory === "All" || product.category === selectedCategory;
        const matchesSearch =
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPrice = product.price <= maxPrice;
        const matchesRating = product.rating >= minRating;

        return matchesCategory && matchesSearch && matchesPrice && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === "lowToHigh") return a.price - b.price;
        if (sortBy === "highToLow") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [selectedCategory, searchTerm, maxPrice, minRating, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setMaxPrice(30000);
    setMinRating(0);
    setSortBy("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shop Catalog</h1>
        <p className="text-slate-500 text-sm mt-1">
          Explore our collection of premium sneakers, electronics, fashion, and accessories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-fit space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FaFilter className="text-blue-600 text-sm" /> Filters
            </h2>
            <button
              onClick={handleResetFilters}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
            >
              <FaRedo className="text-[10px]" /> Reset
            </button>
          </div>

          {/* Search Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Search Keywords
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            </div>
          </div>

          {/* Categories Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Categories
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Max Price
              </label>
              <span className="text-xs font-bold text-blue-600">
                ₹{maxPrice.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="30000"
              step="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Minimum Rating Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Minimum Rating
            </label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
            >
              <option value={0}>All Ratings</option>
              <option value={4.5}>4.5 ★ & Above</option>
              <option value={4.0}>4.0 ★ & Above</option>
            </select>
          </div>

          {/* Sort By Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Sort Order
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="">Default Featured</option>
              <option value="lowToHigh">Price: Low → High</option>
              <option value="highToLow">Price: High → Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500">
              Showing {filteredProducts.length} product(s)
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-2">No matching products found</h3>
              <p className="text-slate-400 text-xs mb-4">
                Try clearing or adjusting your search keywords and price range.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
