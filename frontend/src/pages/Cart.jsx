import { Container, CartItem, CartSummary, Button, Loader } from "../components/index";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router-dom";

function Cart() {
    const { items, total, updateQuantity, removeFromCart, isLoading, isEmpty} = useCart();
    const navigate = useNavigate();

    if(isLoading && items.length === 0) return <Loader/>;

    const groupedItems = [];
    items.forEach((item) => {
        const existing = groupedItems.find((i) => i._id === item._id);
        const quantity = Number(item.quantity);
        if (existing) {
            existing.quantity += quantity;
        } else {
            groupedItems.push({ ...item, quantity });
        }
    });

    return (
        <Container className="pt-4 md:px-0 py-0">
            <h1 className="text-2xl font-bold mb-6 pt-4">Shopping Cart</h1> 
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> 
                <div className={isEmpty ? "lg:col-span-3" : "lg:col-span-2"}>
                    {isEmpty ? (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
                            <Button onClick={() => navigate("/products")}
                                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                Start Shopping
                            </Button>
                        </div>
                    ) : (             
                        groupedItems.map((item) => (
                        <CartItem
                            key={item._id}
                            item={item}
                            onQuantityChange={updateQuantity}
                            onRemove={removeFromCart}
                        />
                        ))
                    )}
                    
                </div>
               

                {!isEmpty && (
                <div className="lg:col-span-1">
                    <CartSummary
                        items={items}
                        total={total}
                        onCheckout={() => navigate('/checkout')}
                    />                  
                </div>
                )}
                    
            </div>
        </Container>
    )
}

export default Cart;
