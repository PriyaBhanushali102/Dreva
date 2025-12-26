import { Link } from "react-router-dom";
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import {Button, Loader} from "../index";
import toast from "react-hot-toast";

function ProductCard({ product, compact = false }) {
    const { addToCart, isLoading } = useCart();
    const { isAuthenticated } = useAuth();

      const handleAddToCart = async (e) => {
        e.preventDefault();
        
          if (!isAuthenticated) {
              toast.error("Please login to add items to cart.")
              return;
          }

        await addToCart(product._id, 1);
    }
    return (
        <div className={`bg-white rounded-lg border overflow-hidden transition
            ${compact
                ? "p-2 shadow-sm hover:shadow-md"
                : "shadow-md hover:shadow-xl"} flex flex-col`}>
            
            {/* Image */}
            <Link to={`/products/${product._id}`}>
                <div className={`relative bg-gray-100 ${compact ? "h-36" : "h-48"}`}>
                    <img
                        src={product.images?.[0]?.url || '/placeholder.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />

                    {product.quantity === 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white text-sm font-semibold bg-red-600 px-3 py-1 rounded">
                                Out of Stock
                            </span>
                    </div>
                    )}
                </div>
            </Link>

            {/* Content */}
            <div className={`${compact ? "p-2" : "p-4"} flex-1 flex flex-col`}>
                <h3 className="font-semibold text-sm truncate hover:text-blue-600">
                    {product.name}
                </h3>
               
                {!compact && (
                    <p className="text-gray-600 text-sm mb-2 uppercase tracking-wide">
                        {product.brand}
                    </p>
                )}
               
                {/* Rating */}
                <div className="flex items-center my-2">
                   
                        {[...Array(5)].map((_, i) => (
                            <FaStar
                                key={i}
                                className={i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}
                                size={12}
                            />
                        ))}
                    
                    <span className="text-gray-500 text-sm ml-2">
                      ({product.reviews?.length || 0})
                    </span>
                </div>

                {/* Price */}
                <span className="text-blue-600 font-bold">
                  ₹{product.price}
                </span>

                    <Button
                        onClick={handleAddToCart}
                        disabled={!isAuthenticated || product.quantity === 0 || isLoading}
                        className="mt-3 bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2"
                    >                
                        {isLoading ? <Loader /> : <><FaShoppingCart />  Add to Cart</>}
                    </Button>
            </div>
        </div>
    )
}

export default ProductCard;



