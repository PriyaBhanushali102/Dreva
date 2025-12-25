import React, { useState } from "react";
import { Container, ProductCard} from "../components/index";
import { FaArrowRight, FaFire, FaStar, FaTags } from "react-icons/fa";
import { useProducts } from "../hooks/useProducts";
import { Link } from "react-router-dom";
import {Button, Loader} from "../components/index"
import { useAuth} from "../hooks/useAuth"
function Home() {
    const { isAuthenticated } = useAuth();
    const [filters, setFilters] = useState({
        q: "",
        category: "",
        minPrice: "",
        maxPrice: "",
        sort: "",
        limit: 8,
    })

    const { products, loading } = useProducts(filters);

    const categories = [
        { name: "Home", icon: "🏠", color: "bg-blue-100 hover:bg-blue-200" },
        { name: "Fashion", icon: "👗", color: "bg-pink-100 hover:bg-pink-200" },
        { name: "Toys", icon: "🧸", color: "bg-yellow-100 hover:bg-yellow-200" },
        { name: "Gadgets", icon: "📱", color: "bg-purple-100 hover:bg-purple-200" },
    ];

        return (
        <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20">
                <Container>
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                            Welcome to <span className="text-yellow-300">Dreva</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-gray-100">
                            Discover premium products at unbeatable prices
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link to="/products">
                                    <Button
                                        variant="hero"
                                        className="bg-white text-black hover:bg-gray px-8 py-3 text-lg font-semibold shadow-lg">
                                    Shop Now <FaArrowRight className="inline ml-2" />
                                </Button>
                            </Link>
                            <Link to="/register">
                                    <Button
                                        className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Features Section */}
            <section className="py-12 bg-white border-b">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaTags className="text-green-600 text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Best Prices</h3>
                            <p className="text-gray-600">Competitive prices on all products</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaStar className="text-blue-600 text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Quality Products</h3>
                            <p className="text-gray-600">Only the best quality items</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaFire className="text-purple-600 text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
                            <p className="text-gray-600">Quick and reliable shipping</p>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Categories Section */}
            <section className="py-16 bg-gray-50">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Shop by Category
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Browse through our wide range of categories
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {categories.map((category) => (
                            <Link
                                key={category.value}
                                to={`/products?category=${category.value}`}
                                className={`${category.color} p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
                            >
                                <div className="text-center">
                                    <div className="text-6xl mb-4">{category.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {category.label}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Featured Products Section */}
            <section className="py-16 bg-white">
                <Container>
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-2">
                                Featured Products
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Check out our latest and greatest items
                            </p>
                        </div>
                        <Link to="/products">
                            <Button className="flex items-center gap-2">
                                View All <FaArrowRight />
                            </Button>
                        </Link>
                    </div>

                    {loading ? (
                        <Loader />
                    ) : products.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">📦</div>
                            <p className="text-2xl text-gray-600 mb-4">No products available yet</p>
                            <p className="text-gray-500">Check back soon for amazing deals!</p>
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
            {!isAuthenticated && (<section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <Container>
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Ready to Start Shopping?
                        </h2>
                        <p className="text-xl mb-8 text-gray-100">
                            Join thousands of happy customers today
                        </p>
                        <Link to="/register">
                                <Button
                                    variant="hero"
                                    className="bg-white text-black hover:bg-gray-100 px-10 py-4 text-lg font-semibold shadow-xl">
                                Create Free Account
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

