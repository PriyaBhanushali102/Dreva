import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import * as authService from "../../services/authService";
import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import { useState } from "react";
import toast from "react-hot-toast";
import {Input, Logo, Container, Button} from "../index"

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isVendor } = useSelector((state) => state.auth);
    const { itemCount } = useSelector((state) => state.cart);
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = async () => {
        try {
            if (isVendor) {
                await authService.logoutVendor();
            } else {
                await authService.logoutUser();
            }

            dispatch(logout());
            toast.success('Logged out successfully');
            navigate('/login');
        } catch {
            toast.error('Logout failed');
        }
    }
    
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?q=${searchQuery}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-700">
            <Container>
                <div className="mx-auto px-6">

                    <div className="flex items-center justify-between py-4">
                        {/* Logo */}
                        <div className="h-10 w-10 flex items-center">
                            <Logo width="100px"/>
                        </div>

                        {/* Search Bar */}
                        <form
                            onSubmit={handleSearch}
                            className="hidden md:flex flex-1 max-w-md mx-8">
                            <div className="relative w-full">
                                <Input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search Products..."
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-black-200 placeholder-gray-400 focus:outline-none"
                                />
                                <Button
                                    type="submit"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                                >
                                    <FaSearch/>
                                </Button>
                            </div>
                        </form>

                        {/* Navigation */}
                        <nav className="flex items-center gap-6 text-sm font-medium">
                            <Link
                                to="/"
                                className="text-gray-300 hover:text-white transition">
                                Home
                            </Link>              
                            {user ? (
                                <> 
                                    {isVendor ? (
                                        // Vendor Navigation
                                        <>
                                            <Link
                                                to="/products"
                                                className="text-gray-300 hover:text-white transition">
                                                Products
                                            </Link>
                                            <Link to="/vendor/dashboard" className="text-gray-300 hover:text-white transition">
                                                Dashboard
                                            </Link>
                                            <Link to="/vendor/products" className="text-gray-300 hover:text-white transition">
                                                My Products
                                            </Link>
                                        </>
                                    ) : (
                                            // User Navigation
                                            <>
                                                <Link
                                                    to="/orders"
                                                    className="text-gray-300 hover:text-white transition">
                                                    Orders
                                                </Link>
                                                <Link to="/users/cart" className="relative">
                                                    <FaShoppingCart
                                                        className="text-xl text-gray-300 hover:text-white transition" />
                                                        {itemCount > 0 && (
                                                        <span
                                                            className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                                                            {itemCount}
                                                        </span>
                                                    )}
                                                </Link>
                                               
                                            </>
                                    )}

                                    {/* User Menu */}
                                    <div className="relative group">
                                        <div className="flex items-center gap-2 text-gray-300 hover:text-white transition cursor-pointer">
                                            <FaUser  className="text-xl"/>
                                            <span className="hidden md:block">{user.name}</span>
                                        </div>
                                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 opacity-0 group-hover:opacity-100 pointer-events-auto transition-opacity duration-200 z-50">
                                            <Link to="/profile" className="block">
                                                <Button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition block">
                                                    Profile
                                                </Button>
                                            </Link>

                                            <Button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition block">
                                                Logout
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                    // Guest Navigation
                                    <>
                                        <Link
                                            to="/login"
                                            className="text-gray-300 hover:text-white transition"
                                        >
                                            Login
                                        </Link>

                                        <Link
                                            to="/register"
                                            className="text-gray-300 hover:text-white transition"
                                        >
                                            Register
                                        </Link>
                                    </>
                            )}
                        </nav>
                    </div>
                </div>
            </Container>
        </header>
    )
}

export default Header;
