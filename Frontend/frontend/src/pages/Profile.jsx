import { Container, Input, Button } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaBox, FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateProfile } from "../store/slices/authSlice";
import toast from "react-hot-toast";
import { useState } from "react";
import { useEffect } from "react";

function Profile() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
    })

    useEffect(() => {
        if (user) {
            setFormData({
                namw: user.name || "",
                email: user.email || "",
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

            }
            dispatch(updateProfile(updatedUser));
            toast.success("Profile updated");
        } catch {
            toast.error("Update failed");
        }
    }
    const handleLogout = () => {
        dispatch(logout());
        toast.success("Logged out successfully");
        navigate("/login");
    };

    return (
        <Container>
            <div className="flex flex-col md:flex-row gap-6 py-8">

                {/* Left menu */}
                <div className="w-full md:w-1/4 bg-white border rounded-lg p-4">
                    <h3 className="font-semibold mb-4">
                        Account
                    </h3>

                    <ul className="space-y-3 text-gray-600">
                        <li>
                            <Link
                                to="/profile"
                                className="flex items-center gap-2 font-medium"
                            >
                                <FaUser/> Profile
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/orders"
                                className="flex items-center gap-2 font-medium"
                            >
                                <FaBox/> Orders
                            </Link>
                        </li>

                        <li>
                            <Link
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-red-500 cursor-pointer"
                            >
                                <FaSignOutAlt/> Logout
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Right Content */}
                <div className="w-full md:w-3/4 bg-white border rounded-lg p-6">  
                    <h2 className="text-xl font-semibold mb-6">
                        Profile Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input
                          label="Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                        />

                    <Input
                        label="Email"
                        value={formData.email}
                        disabled
                    />
                    <Input
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button onClick={handleUpdate}>
                            Update Profile
                        </Button>
                    </div>

                </div>
            </div>
        </Container>
    )
}

export default Profile;