import React, { useState } from "react";
import { Container, ProductCard} from "../components/index";
import { FaArrowRight } from "react-icons/fa";
import { useProducts } from "../hooks/useProducts";
import { Link } from "react-router-dom";
import {Button, Loader} from "../components/index"
import { useSelector } from "react-redux";

function Home() {
    const { isAuthenticated } = useSelector((state) => state.auth);
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
        { name: "Home", value: "home" },
        { name: "Fashion", value: "fashion" },
        { name: "Toys", value: "toys" },
        { name: "Gadgets", value: "gadgets" },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gray-50 border-b">
                <Container>
                    <div className="py-16 md:py-20">
                        <div className="max-w-3xl">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Find Quality Products at Great Prices
                            </h1>
                            <p className="text-lg text-gray-600 mb-8">
                                Browse our collection of carefully selected products for your everyday needs
                            </p>
                            <div className="flex gap-4">
                                <Link to="/products">
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5">
                                        Shop Now
                                    </Button>
                                </Link>
                                {!isAuthenticated && (
                                    <Link to="/register">
                                        <Button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2.5">
                                            Sign Up
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Categories Section */}
            <section className="py-12 bg-gray-50">
                <Container>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categories.map((category) => (
                            <Link
                                key={category.value}
                                to={`/products?category=${category.value}`}
                                className="bg-white border border-gray-200 rounded-lg p-8 hover:border-blue-600 hover:shadow-md transition-all text-center group"
                            >
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {category.name}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Featured Products Section */}
            <section className="py-12 bg-white border-t">
                <Container>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
                        <Link to="/products">
                            <Button className="flex items-center gap-2 text-sm border border-gray-300 hover:bg-gray-100">
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
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
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Ready to Get Started?
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Create an account to start shopping and track your orders
                            </p>
                            <Link to="/register">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
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