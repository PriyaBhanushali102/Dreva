import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Button, Loader } from "../components";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import toast from "react-hot-toast";
import { FaBox, FaShippingFast, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function OrderHistory() {
    const { user,isVendor, isAuthenticated } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        pages: 0,
        limit: 12,
    });

    useEffect(() => {
        const fetchOrders = async () => {
            if (!isAuthenticated) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(`/api/orders/history?page=${page}&limit=12`, {
                    withCredentials: true,
                });
                setOrders(response.data.data || []);
                setPagination(response.data.pagination || {});
                setError(null);
            } catch (error) {
                setError(error.response?.data?.message || "Failed to load orders");
                toast.error("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [isAuthenticated, page]);

    // Cancel order
    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) {
            return;
        }
        try {
            const order = orders.find(o => o.id === orderId);
            if (order && orders.status == "Processing") {
                await axios.delete(`api/orders/${orderId}`, {
                    withCredentials: true,
                });
                toast.success("Order cancelled successfully");

                // Refresh Orders
                setOrders(orders.filter((order) => order._id !== orderId));
            } else {
                toast.error("Order is already shipped");
            }          
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel order");
        }
    }

     // Filter orders by status
    const filteredOrders = filter === "all" 
        ? orders 
        : orders.filter(order => order.status.toLowerCase() === filter.toLowerCase());
    
    // Status icon mapper
    const getStatusIcon = (status) => {
        switch(status) {
            case "Processing":
                return <FaBox className="text-yellow-500" />;
            case "Shipped":
                return <FaShippingFast className="text-blue-500" />;
            case "Delivered":
                return <FaCheckCircle className="text-green-500" />;
            default:
                return <FaTimesCircle className="text-gray-500" />;
        }
    };

    // Status color mapper
    const getStatusColor = (status) => {
        switch(status) {
            case "Processing":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "Shipped":
                return "bg-blue-100 text-blue-800 border-blue-300";
            case "Delivered":
                return "bg-green-100 text-green-800 border-green-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };
    
    if (loading) return <Loader />
    
     if (!isAuthenticated) {
        return (
            <Container>
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Please Login to View Orders
                    </h2>
                    <Link to="/login">
                        <Button>Go to Login</Button>
                    </Link>
                </div>
            </Container>
        );
    }

     if (error) {
        return (
            <Container>
                <div className="text-center py-20">
                    <p className="text-red-600 text-lg mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>
                        Retry
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div>
            {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mt-5 mb-2">My Orders</h1>
                    <p className="text-gray-600">Track and manage your orders</p>
                </div>

                {/* Filter Tabs */}
                {isVendor && (
                    <div className="flex gap-2 mb-6 overflow-x-auto border-b pb-2">
                    {["all", "Processing", "Shipped", "Delivered"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-6 py-2 rounded-t-lg font-medium whitespace-nowrap transition ${
                                filter === status
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {status === "all" ? "All Orders" : status}
                            {status === "all" && ` (${orders.length})`}
                        </button>
                    ))}
                    </div>
                )}

                 {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-lg shadow-md">
                        <FaBox className="mx-auto text-6xl text-gray-300 mb-4" />
                        <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                            No Orders Found
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {filter === "all"
                                ? "You haven't placed any orders yet"
                                : `No ${filter} orders`}
                        </p>
                        <Link to="/products">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                Start Shopping
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200"
                            >
                                {/* Order Header */}
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="text-3xl">
                                                {getStatusIcon(order.status)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-xl text-gray-900">
                                                    Order #{order._id.slice(-8).toUpperCase()}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Body */}
                                <div className="p-6">
                                    {/* Order Items */}
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-gray-700 mb-3">Order Items</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {order.items?.slice(0, 4).map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <img
                                                        src={item.image || '/placeholder.jpg'}
                                                        alt={item.name}
                                                        className="w-16 h-16 object-cover rounded border"
                                                        onError={(e) => {
                                                            e.target.src = '/placeholder.jpg';
                                                        }}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-sm text-gray-900 truncate">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Qty: {item.quantity}
                                                        </p>
                                                        <p className="text-sm font-semibold text-blue-600">
                                                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            {order.items?.length > 4 && (
                                                <div className="flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg p-3">
                                                    <p className="text-sm font-medium">
                                                        +{order.items.length - 4} more items
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t">
                                        <div className="space-y-1">
                                            <p className="text-gray-600">
                                                <span className="font-semibold">Total Items:</span> {order.quantity}
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-semibold">Subtotal:</span> ₹{order.subtotal?.toLocaleString('en-IN')}
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-semibold">Tax:</span> ₹{order.tax?.toLocaleString('en-IN')}
                                            </p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                Total: ₹{order.total?.toLocaleString('en-IN')}
                                            </p>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3">
                                            
                                            {order.status === "Processing" && (
                                                <Button
                                                    onClick={() => handleCancelOrder(order._id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-6"
                                                >
                                                    Cancel Order
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                 {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <Button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ← Previous
                        </Button>
                        
                        <span className="text-gray-700 font-medium">
                            Page {page} of {pagination.pages}
                        </span>
                        
                        <Button
                            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                            disabled={page >= pagination.pages}
                            className="px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next →
                        </Button>
                    </div>
                )}

           
            </div>
        </Container>
    )
}

export default OrderHistory;
