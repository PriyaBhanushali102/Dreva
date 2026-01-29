import { Container, Button, Loader } from "../../components/index";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import * as orderService from "../../services/orderService";
import * as authService from "../../services/authService";
import { FaBox, FaShoppingBag, FaChartLine, FaDollarSign } from "react-icons/fa";
import toast from "react-hot-toast";

function VendorDashboard() {
    const { user, isVendor } = useAuth();
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
    })

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);

                const [ordersRes, productRes] = await Promise.all([
                    orderService.getVendorOrders(),
                    authService.getVendorProduct(),
                ]);
                
                const orders = ordersRes.data.data || [];
                const products = productRes.data.data || [];

                const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
                const pending = orders.filter(o => o.status === "Processing").length;

                setStats({
                    totalProducts: products.length,
                    totalOrders: orders.length,
                    totalRevenue: revenue,
                    pendingOrders: pending,
                });
            } catch (error) {
                toast("Failed to fetch stats: ", error)
            } finally {
                setLoading(false);
            }
        };

        if (isVendor) {
            fetchStats();
        }
    }, [isVendor]);

    if (loading) return <Loader />
    
    return (
        <Container>
            <div className="py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
                        <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
                    </div>
                    
                    <Link to="/vendor/products/add">
                        <Button className="flex items-center gap-2">
                            <FaBox/> Add Product
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */} 
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Link to="/vendor/products" className="block">
                    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <FaBox className="text-blue-600 text-2xl"/>
                            </div>
                            <span className="text-sm text-gray-500">Total</span>
                        </div>

                        <h3 className="text-3xl font-bold text-gray-900">{stats.totalProducts}</h3>
                        <p className="text-gray-600 mt-1">Products</p>    
                    </div>
                    </Link>

                    <Link to="/vendor/orders" className="block">
                    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <FaShoppingBag className="text-green-600 text-2xl"/>
                            </div>
                            <span className="text-sm text-gray-500">Total</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">{stats.totalOrders}</h3>
                        <p className="text-gray-600 mt-1">Orders</p>
                    </div>
                    </Link>

                    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <FaDollarSign className="text-purple-600 text-2xl"/>
                            </div>
                            <span className="text-sm text-gray-500">Total</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900"> ₹{stats.totalRevenue.toLocaleString('en-IN')}</h3>
                        <p className="text-gray-600 mt-1">Revenue</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                       <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <FaChartLine className="text-orange-600 text-2xl" />
                            </div>
                            <span className="text-sm text-gray-500">Pending</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">{stats.pendingOrders}</h3>
                        <p className="text-gray-600 mt-1">Processing Orders</p>
                    </div>            
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link to="/vendor/products" className="block">
                        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-2 border-transparent hover:border-blue-500">
                            <h3 className="text-xl font-bold mb-2">Manage Products</h3>
                            <p className="text-gray-600">View, edit and delete your products</p>
                        </div>
                    </Link>

                    <Link to="/vendor/orders" className="block">
                        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-2 border-transparent hover:border-blue-500">
                            <h3 className="text-xl font-bold mb-2">View Orders</h3>
                            <p className="text-gray-600">Track and manage customer orders</p>
                        </div>
                    </Link>

                    <Link to="/vendor/reviews" className="block">
                        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-2 border-transparent hover:border-blue-500">
                            <h3 className="text-xl font-bold mb-2">Customer Review</h3>
                            <p className="text-gray-600">See what cusotmer saying</p>
                        </div>
                    </Link>
                </div>
            </div>
        </Container>
    )
}

export default VendorDashboard;