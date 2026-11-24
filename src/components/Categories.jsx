import CategoryCard from "./CategoryCard";

function Categories({ selectedCategory, setSelectedCategory }) {
  const categories = [
  "All",
  "Electronics",
  "Shoes",
  "Clothing",
  "Accessories",
];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-4xl font-bold text-center mb-10">
        Shop by Category
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((category) => (
          <CategoryCard 
             key={category} title={category} 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}/>
        ))}
      </div>
    </section>
  );
}

export default Categories;