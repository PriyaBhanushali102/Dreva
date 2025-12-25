import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { formatPrice } from "../../utils/helper"
import { Button} from "../index"

function CartSummary() {
    const navigate = useNavigate();
    const { getCartSummary } = useCart();
    const { total, itemCount } = getCartSummary();

    return (
        <div className="bg-white p-6 rounded-lg shadow-md sticky top-20 border border-gray-200">
            <h3 className="ext-xl font-bold mb-6 text-gray-800 uppercase tracking-wider">
                Order Summary
            </h3>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Items:</span>
                    <span className="font-semibold">{itemCount}</span>
                </div>
                <div className="border-t border-gray-300 pt-3 flex justify-between text-xl">
                    <span className="font-bold text-gray-800">Total:</span>
                    <span className="font-bold text-gray-600">{formatPrice(total)}</span>
                </div>
                <p className="text-sm text-gray-500">Tax included in total</p>
            </div>

            <Button
                onClick={() => navigate('/checkout')}
                fullWidth
                className="mb-3"
            >
                Proceed to Checkout
            </Button>

            <Button
                onClick={() => navigate('/products')}
                variant="outline"
                fullWidth
            >
                Continue Shopping
            </Button>
        </div>
    )
}

export default CartSummary;