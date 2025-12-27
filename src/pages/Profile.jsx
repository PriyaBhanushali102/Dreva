import { Container, Input, Button } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaBox, FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateProfile } from "../store/slices/authSlice";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    })

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
            })
        }
    }, [user])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleUpdate = async () => {
        try {
            const updatedUser = {
                ...user,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
            }
            dispatch(updateProfile(updatedUser));
            toast.success("Profile updated successfully");
        } catch {
            toast.error("Failed to update profile");
        }
    }

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Logged out successfully");
        navigate("/login");
    };

    const menuItems = [
        { to: "/profile", icon: FaUser, label: "Profile", active: true },
        { to: "/orders", icon: FaBox, label: "Orders", active: false },
    ];

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <Container>
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
                    <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="lg:w-64">
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                                        {user?.name?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{user?.name}</h3>
                                        <p className="text-sm text-gray-500">{user?.email}</p>
                                    </div>
                                </div>
                            </div>

                            <nav className="p-2">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                                            item.active
                                                ? "bg-blue-50 text-blue-600 font-medium"
                                                : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                    >
                                        <item.icon className="text-lg" />
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                                
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-2"
                                >
                                    <FaSignOutAlt className="text-lg" />
                                    <span>Logout</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                                <p className="text-sm text-gray-600 mt-1">Update your personal details</p>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <Input
                                        label="Full Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <Input
                                        label="Email Address"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                </div>

                                <div>
                                    <Input
                                        label="Phone Number"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
                                <Button 
                                    onClick={() => setFormData({
                                        name: user?.name || "",
                                        email: user?.email || "",
                                        phone: user?.phone || "",
                                    })}
                                    className="border border-gray-300 text-white bg-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleUpdate}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Profile;