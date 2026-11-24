function CategoryCard({
  title,
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <div
      onClick={() =>
      setSelectedCategory(
        selectedCategory === title ? "All" : title
      )
    }
      className={`p-6 rounded-xl text-center cursor-pointer transition shadow-md
      ${
        selectedCategory === title
          ? "bg-blue-600 text-white"
          : "bg-white hover:shadow-xl"
      }`}
    >
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  );
}

export default CategoryCard;