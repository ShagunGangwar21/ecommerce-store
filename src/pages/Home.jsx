import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";

function Home( {searchTerm, selectedCategory, setSelectedCategory, sortBy} ){
    return (
        <>
      <Hero />
      <Categories 
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
    />
      <FeaturedProducts
      searchTerm={searchTerm}
      selectedCategory={selectedCategory}
      sortBy={sortBy}
       />
    </>
    )
}

export default Home;