import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useCart } from "../../hooks/useCart";
import { Button } from "../index"

function CartItem({ item }) {
    const { updateQuantity, removeFromCart, isLoading } = useCart();

    const handleUpdateQuantity = async (newQuantity) => {
        if (newQuantity < 1) return;
        await updateQuantity(item._id, newQuantity);
    };

    const handleRemove = async () => {
        await removeFromCart(item._id);
    }

    return (
        <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <img
                src={item.image || "/placeholder.jpg"}
                alt={item.name}
                className="w-20 h-20 object-cover rounded border border-gray-200"
            />

            <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                <p className="text-gray-600 font-medium">₹{item.price?.toLocaleString()}</p>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <Button
                    onClick={() => handleUpdateQuantity(item.quantity - 1)}
                    disabled={isLoading}
                    className="p-2 hover:bg-gray-200 rounded transition disabled:opacity-50"
                >
                    <FaMinus className="text-sm text-white" />
                </Button>
                <p className="w-12 text-center font-bold text-gray-800">
                   { item.quantity}
                </p>
                <Button
                    onClick={() => handleUpdateQuantity(item.quantity + 1)}
                    disabled={isLoading}
                    className="p-2 hover:bg-gray-200 rounded transition disabled:opacity-50"
                >
                    <FaPlus className="text-sm text-white" />
                </Button>
            </div>

            <div className="text-right">
                <p className="font-bold text-lg text-gray-800">
                    ₹{(item.price * item.quantity)?.toLocaleString()}
                </p>
            </div>

            <Button
                onClick={handleRemove}
                disabled={isLoading}
                className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
            >
                <FaTrash />
            </Button>
        </div>
    );
}

export default CartItem;


