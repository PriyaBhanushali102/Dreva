import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import * as authService from "../../services/authService";
import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import {Input, Logo, Container, Button} from "../index"

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isVendor } = useSelector((state) => state.auth);
    const { itemCount } = useSelector((state) => state.cart);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // close if you click anywhere outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        const toastId = toast.loading('Signing out...');
        try {
            if (isVendor) {
                await authService.logoutVendor();
            } else {
                await authService.logoutUser();
            }

            dispatch(logout());
            toast.success('Signed out successfully', { id: toastId });
            navigate('/login');
        } catch {
            toast.error('Session ended locally', { id: toastId });
            dispatch(logout()); 
            navigate('/login');
        }
    }
    
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${searchQuery}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
            <Container>

                    <div className="flex items-center justify-between py-4 gap-4">
                        {/* Logo */}
                        <div className="w-10 h-10 flex-shrink-0">
                            <Link to="/" className="flex item-center">
                                <Logo width="100px"/>
                            </Link>
                       </div>

                        {/* Search Bar */}
                        <form
                            onSubmit={handleSearch}
                            className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-10">
                            <div className="relative w-full">
                                <Input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search Products..."
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none"
                                />
                                <Button
                                    type="submit"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"                                >
                                    <FaSearch/>
                                </Button>
                            </div>
                        </form>

                        {/* Navigation */}
                        <nav className="flex items-center gap-4 lg:gap-6 text-sm font-medium">
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
                                    <div className="relative" ref={menuRef}>
                                        <div onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2 text-gray-300 hover:text-white transition cursor-pointer select-none">
                                            {user?.image ? (
                                            <img
                                                src={user.image}
                                                alt={user.name}
                                                className="w-10 h-10 rounded-full object-cover border border-gray-600"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'block';
                                                }}
                                            />
                                            ) : null}
                                                                                  
                                            {!user?.image && <FaUser className="text-xl"/>}     
                                            <span className="hidden md:block">{user.name}</span>
                                        
                                            <span className={`transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}>
                                                ▾
                                            </span>
                                        </div>
                                    
                                    {isMenuOpen && (<div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 z-50">
                                        <Link to="/profile" className="block" onClick={() => setIsMenuOpen(false)}>
                                            <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition">
                                                Profile
                                            </button>
                                        </Link>

                                        <button
                                            onClick={() =>{
                                                setIsMenuOpen(false);
                                                handleLogout();
                                            }}
                                            className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition block">
                                            Logout
                                        </button>
                                    </div>
                                    )}
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
            </Container>
        </header>
    )
}

export default Header;
