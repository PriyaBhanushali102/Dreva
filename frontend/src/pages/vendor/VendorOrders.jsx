import { Container, Button, Loader } from "../../components";
import { useState, useEffect } from "react";
import * as orderService from "../../services/orderService";
import toast from "react-hot-toast";
import { ORDER_STATUS_COLORS } from "../../utils/constants";

function VendorOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderService.getVendorOrders();
            setOrders(response.data.data || []);
        } catch {
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            toast.success("Order status updateed");
            fetchOrders();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    };

    const filteredOrders = filter === "All" ? orders : orders.filter(o => o.status.toLowerCase() === filter);

    if (loading) return <Loader />
    
    return (
        <Container>
            <div className="py-8">
                <h1 className="text-3xl font-bold mb-8">
                    Orders
                </h1>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 border-b">
                    {["All", "Processing", "Shipped", "Delivered"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 font-medium capatalize ${ 
                                filter === status ? 'border-b-2 border-blue-600 text-blue-600' : 
                                'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-600">No orders found</p>
                   </div>
                ): (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <div key={order._id} className="bg-white p-6 rounded-lg shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="font-semibold text-lg">
                                            Order #{order._id.slice(-8).toUpperCase()}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(order.createdAt).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${ORDER_STATUS_COLORS[order.status]}`}>
                                            {order.status}
                                    </span>
                                </div>

                                <div className="border-t pt-4">
                                    <p className="text-gray-700 mb-2">
                                        <span className="font-semibold">
                                            Customer:
                                        </span> {order.customer?.name}
                                    </p>
                                    <p className="text-gray-700 mb-2">
                                        <span className="font-semibold">
                                            Total:
                                        </span>  ₹{order.total.toLocaleString('en-IN')}
                                    </p>

                                    {order.status !== "Delivered" && (
                                        <div className="flex gap-2">
                                            {order.status === "Processing" && (
                                                <Button onClick={() => handleUpdateStatus(order._id, "Shipped")}>
                                                    Mark as Shipped
                                                </Button>
                                            )}
                                            {order.status === "Shipped" && (
                                                <Button onClick={() => handleUpdateStatus(order._id, "Delivered")}>
                                                    Mark as Delivered
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>                                 
                            </div>
                        ))}   
                    </div>
                )}
            </div>
        </Container>
    )
}

export default VendorOrders;

