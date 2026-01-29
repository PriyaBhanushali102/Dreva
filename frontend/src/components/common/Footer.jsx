import React from "react";
import { Link } from 'react-router-dom'
import Logo from "./Logo";

function Footer() {
    return (
     <section className="relative overflow-hidden py-10 bg-gray-900 border border-t-2 border-gray-700 shadow-inner border-t-black">
            <div className="relative z-10 mx-auto max-w-7xl px-6">
                <div className="-m-6 flex flex-wrap">

                    {/* Logo + Copyright */}
                    <div className="w-full p-6 md:w-1/2 lg:w-5/12">
                        <div className="flex h-full flex-col justify-between">
                            <div className="mb-6 flex items-center">
                                <Logo className="w-[180px] md:w-[220px] lg:w-[260px] object-contain" />
                            </div>
                            
                            <div>
                                <p className="text-sm text-gray-400">
                                    &copy; 2025 Dreva Store. All Rights Reserved.
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Shop Section */}
                    <div className="w-full p-6 md:w-1/2 lg:w-2/12">
                        <div className="h-full">
                            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-300">
                                Shop
                            </h3>

                            <ul className="space-y-3">
                                <li className="mb-4">
                                    <Link
                                        className="footer-link text-gray-400 hover:text-white transition"
                                        to="/products"
                                    >
                                        All Products
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link
                                        className="footer-link text-gray-400 hover:text-white transition"
                                        to="/categories"
                                    >
                                        Categories
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link
                                        className="footer-link text-gray-400 hover:text-white transition"
                                        to="/new-arrivals"
                                    >
                                        New Arrivals
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="footer-link text-gray-400 hover:text-white transition"
                                        to="/best-sellers"
                                    >
                                        Best Sellers
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Customer Service */}
                    <div className="w-full p-6 md:w-1/2 lg:w-2/12">
                        <div className="h-full">

                            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-300">
                                Customer Service
                            </h3>

                            <ul className="space-y-3">
                                <li className="mb-4">
                                    <Link
                                        to="/profile"
                                        className="footer-link text-gray-400 hover:text-white transition"
                                    >
                                        My Account
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link
                                        to="/orders"
                                        className="footer-link text-gray-400 hover:text-white transition"
                                    >
                                        My Orders
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link
                                        to="/wishlist"
                                        className="footer-link text-gray-400 hover:text-white transition"                                    >
                                        Wishlist 
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/track-order"
                                        className="footer-link text-gray-400 hover:text-white transition"                                    >
                                        Track Order
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Company */}
                    <div className="w-full p-6 md:w-1/2 lg:w-3/12">
                        <div className="h-full">

                            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-300">
                                Company
                            </h3>

                            <ul className="space-y-3">
                                <li className="mb-4">
                                    <Link
                                        to="/about"
                                        className="footer-link text-gray-400 hover:text-white transition"      
                                    >
                                        About Us
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link
                                        to="/careers"
                                        className="footer-link text-gray-400 hover:text-white transition"
                                        
                                    >
                                        Careers
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/contact"
                                        className="footer-link text-gray-400 hover:text-white transition"
                                        
                                    >
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                     {/* Legal */}
                    <div className="w-full p-6 mt-6 border-t border-gray-700">
                        <div className="h-full">

                            <ul className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                                <li className="mb-4">
                                    <Link
                                        to="/privacy-policy"
                                        className="text-gray-400 hover:text-white transition"
                                        
                                    >
                                       Privacy Policy
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link
                                        to="/terms"
                                        className="text-gray-400 hover:text-white transition"
                                        
                                    >
                                        Terms & Conditions
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/refund-policy"
                                        className="text-gray-400 hover:text-white transition"
                                        
                                    >
                                        Refund Policy
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </section>
  )
}

export default Footer;