import React, { useState } from "react";
import { Container, ProductCard, Button, Loader, Input } from "../components/index";
import { FaArrowRight, FaSearch } from "react-icons/fa";
import { useProducts } from "../hooks/useProducts";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Home() {
  const { user } = useSelector((state) => state.auth);
  const isAuthenticated = !!user;
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    q: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    sort: "",
    limit: 8,
  });

  const { products, loading } = useProducts(filters);

  const categories = [
    { name: "Home & Living", value: "Home & Living", img: "/images/home.jpg"},
    { name: "Fashion", value: "Fashion", img: "/images/fashion1.jpg" },
    { name: "Beauty", value: "Beauty", img: "/images/beauty.jpg"},
    { name: "Accessories", value: "Accessories", img: "/images/accessories.jpg"},
  ];

  const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?q=${searchQuery}`);
        }
  };
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
          <Container>
          <div className="relative z-10 py-16 md:py-20 text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold text-blue-800 mb-4">
              Dreva
            </h1>
            <span className="block text-gray-900 text-3xl md:text-4xl font-semibold mb-4">
              Quality products, Great prices
            </span>
            <p className="text-gray-700 text-lg md:text-xl mb-8">
              Browse our carefully selected collection for your everyday needs
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/products">
                <button className="bg-blue-800 hover:bg-blue-700 text-white px-8 py-3 font-semibold rounded-lg transition-transform hover:scale-105 shadow-md">
                  Shop Now
                </button>
              </Link>
              {!isAuthenticated && (
                <Link to="/register">
                  <Button className="text-gray-700 px-8 py-3 transition-transform hover:scale-105 shadow-md">
                    Sign Up
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative w-3/4 max-w-x mx-auto">
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Products..."
                    className="w-full pl-4 pr-12 py-2 bg-gray-700 rounded-full border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                <Button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaSearch/>
                </Button>
              </div>
            </form>
          </div>
        </Container>
        
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        
        <Container>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center md:text-left">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.value}
                to={`/products?category=${encodeURIComponent(category.value)}`}
                className="group bg-white rounded-xl shadow-sm border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
              >
                <div className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-500">
                  <img
                    src={category.img}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-gray-800">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 bg-white border-t">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <Link to="/products">
              <Button className="flex items-center gap-2 text-sm border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-lg">
                View All <FaArrowRight className="text-xs" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-gray-400 mb-3">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <p className="text-lg text-gray-600 mb-2">No products available yet</p>
              <p className="text-sm text-gray-500">Check back soon for new arrivals</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 bg-gray-50 border-t">
          <Container>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-gray-700 text-lg md:text-xl mb-8">
                Create an account to start shopping and track your orders
              </p>
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-semibold rounded-lg transition-transform hover:scale-105 shadow-md">
                  Create Account
                </Button>
              </Link>
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}

export default Home;
