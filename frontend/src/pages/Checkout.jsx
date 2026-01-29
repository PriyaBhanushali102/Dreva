import { Button, Container, Input, Loader, Select } from "../components";
import { useState } from "react";
import * as orderService from "../services/orderService"
import * as paymentService from "../services/paymentService";
import toast from "react-hot-toast";
import {PAYMENT_METHODS, TAX_RATE} from "../utils/constants"
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";

function Checkout() {
    const navigate = useNavigate();
    const { items, total, isLoading: cartLoading } = useCart();

    const taxAmount = total * TAX_RATE;
    const grandTotal = total + taxAmount;

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zipcode: "",
        paymentMethod: "COD",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.address) {
            toast.error("Please fill all required fields");
            return;
        }

        if (items.length === 0) {
            toast.error("Your cart is empty");
            return;
        }
        setIsSubmitting(true);

        try {
            // === LOGIC 1: ONLINE PAYMENT (Stripe) ===
            if (formData.paymentMethod === "Card" || formData.paymentMethod === "UPI") {
                
                // fetch stripe session url form backend
                const response = await paymentService.createCheckoutSession({
                    ...formData, items, total: grandTotal, tax: taxAmount
                })

                if (response.data?.url) {
                    window.location.href = response.data.url;
                } else {
                    toast.error("Payment Error");
                }
            }
            // === LOGIC 2: CASH ON DELIVERY (COD) ===
            else {
           
                // Create Order
            
                const response = await orderService.createOrder({
                    ...formData,
                    items,
                    total: grandTotal,
                    tax: taxAmount,
                })
                toast.success("Order placed succcessfully!");
                navigate(`/order-confirmation/${response.data.orderId || response.data.data._id}`);
            }
        }
        catch (error) {
            console.error("Order Error:", error);
            toast.error(error.response?.data?.message || "Failed to place order");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cartLoading) {
        return (
            <Container>
                <Loader/>
            </Container>
        )
    }

    if (items.length === 0) {
        return (
            <Container>
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                    <Button onClick={() => navigate("/products")}>
                        Continue Shopping
                    </Button>
                </div>
            </Container>
        )
    }
    return (
        <Container >
            <div className="pt-4">                          
                <h1 className="text-3xl font-semibold mb-6">
                Checkout
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Contact Information</h2>
                            

                            <Input
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none transition"
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
                            />
                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none transition"
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required  
                                />
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Shipping Address</h2>

                                <Input
                                    label="Street Address"
                                    name="address"
                                    value={formData.address}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none transition"                                  
                                    onChange={handleChange}
                                    placeholder="Enter your address"
                                    required
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="City"
                                        name="city"
                                        value={formData.city}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none transition"                                       
                                        onChange={handleChange}
                                        placeholder="City"
                                        required
                                    />
                                    
                                    <Input
                                        label="State"
                                        name="state"
                                        value={formData.state}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none transition"                                       
                                        onChange={handleChange}
                                        placeholder="State"
                                        required
                                    />
                                </div>

                                <Input
                                    label="ZIP Code"
                                    name="zipcode"
                                    value={formData.zipcode}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none transition"
                                    onChange={handleChange}
                                    placeholder="ZIP Code"
                                    required
                                />
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Payment Method</h2>
                                
                                <Select
                                    label="Payment Method"
                                    name="paymentMethod"                           
                                    value={formData.paymentMethod}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none transition"
                                    onChange={handleChange}
                                    options={PAYMENT_METHODS}
                                />
                            </div>
                            
                             <Button 
                                type="submit" 
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting 
                                    ? "Processing..." 
                                    : formData.paymentMethod === "COD" ? "Place COD Order" : "Proceed to Pay"}
                            </Button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1 top-24">
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow top-4">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>

                            <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto pr-2">
                                {items.map((item) => {
                                    const product = item.product;
                                    if (!product || typeof product === "string") return null;

                                    return (
                                        <div key={product._id} className="flex justify-between text-sm">
                                            <span className="truncate flex-1">{product.name} x {item.quantity}</span>
                                            <span className="font-medium">₹{(product.price * item.quantity).toLocaleString('en-IN')}</span>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{total.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">GST (18%)</span>
                                    <span>₹{taxAmount.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t pt-2">
                                    <span>Total Amount</span>
                                    <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            
            </div>
        </Container>
    )
}

export default Checkout;
