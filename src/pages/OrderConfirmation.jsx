import { Link } from "react-router-dom";
import { Container, Button } from "../components/index";
import { FaCheckCircle } from "react-icons/fa";
function OrderConfirmation() {
    return (
        <Container>
            <div className="max-w-2xl mx-auto text-center py-16">
                <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Order Placed Successfully!
                </h1>

                <p className="text-gray-600 mb-8">
                    Thank you for your purchase.Your order has been confirmed and shipped soon.
                </p>

                <div className="flex justify-center gap-4">
                    <Link to='/orders'>
                        <Button>
                            View Orders
                        </Button>
                    </Link>
                    <Link to='/products'>
                        <Button variant="secondary">
                            Continue Shopping
                        </Button>
                    </Link>
                </div>
            </div>
        </Container>
    )
}

export default OrderConfirmation;
