import ProductCard from "./ProductCard";
import products from "../data/products";

function FeaturedProducts({ searchTerm, selectedCategory, sortBy }) {
  const filteredProducts = products
    .filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) => {
      if (selectedCategory === "All") {
        return true;
      }
      return product.category === selectedCategory;
    })
    .sort((a, b) => {
      if (sortBy === "lowToHigh") {
        return a.price - b.price;
      }

      if (sortBy === "highToLow") {
        return b.price - a.price;
      }

      if (sortBy === "rating") {
        return b.rating - a.rating;
      }

      return 0;
    });

  if (filteredProducts.length === 0) {
    return (
      <section className="max-w-7xl mx-auto py-16 px-4">
        <h2 className="text-4xl font-bold text-center mb-10">
          Featured Products
        </h2>

        <p className="text-center text-xl text-gray-500">
          No products found.
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto py-16 px-4">
      <h2 className="text-4xl font-bold text-center mb-10">
        Featured Products
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;