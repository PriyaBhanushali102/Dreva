import { Link } from "react-router-dom";
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import {Button, Loader} from "../index";
import toast from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";

function ProductCard({ product, compact = false, onDelete}) {
    const { addToCart, isLoading } = useCart();
    const { isAuthenticated, user, isVendor } = useAuth();

    const isOwner = isVendor && user._id === (product.vendor?._id || product.vendor);
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
            <div className={`${compact ? "p-1" : "p-2"} flex-1 flex flex-col`}>
                <Link to={`/products/${product._id}`}>
                    <h3 className="font-semibold text-sm truncate hover:text-blue-600">
                        {product.name}
                    </h3>
                </Link>
               
                {!compact && (
                    <p className="text-gray-600 text-sm mb-1 uppercase tracking-wide">
                        {product.brand}
                    </p>
                )}
               
                {/* Rating */}
                <div className="flex items-center my-1">
                   
                        {[...Array(5)].map((_, i) => (
                            <FaStar
                                key={i}
                                className={i < Math.floor(product.rating || 3) ? 'text-yellow-400' : 'text-gray-300'}
                                size={12}
                            />
                        ))}
                    
                    <span className="text-gray-500 text-sm ml-2">
                      ({product.reviews?.length || 0})
                    </span>
                </div>

                {/* Price */}
                <div className="flex justify-between items-center mb-1">
                    <span className="text-blue-600 font-bold">
                        ₹{product.price}
                    </span>

                    {isOwner ? (
                        /* For the Vendor: Show exact stock count */
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${product.quantity > 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            Stock: {product.quantity}
                        </span>
                    ) : (
                        /* For the Customer: Show "Low Stock" warning if quantity is low but > 0 */
                        product.quantity > 0 && product.quantity <= 5 && (
                            <span className="text-red-500 text-[10px] font-bold animate-pulse">
                                Only {product.quantity} left!
                            </span>
                        )
                    )}
                </div>



                {/* --- CONDITIONAL ACTIONS --- */}
                <div className="mt-auto">
                    {isOwner ? (
                        /* Show Edit/Delete for the Vendor who owns the product */
                        <div className="flex gap-2">
                            <Link to={`/vendor/products/${product._id}`} className="flex-1">
                                <Button className="w-full flex items-center justify-center gap-2 text-xs py-2">
                                    <FaEdit /> Edit
                                </Button>
                            </Link>
                            <Button 
                                variant="danger"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onDelete && onDelete(product._id);
                                }}
                                className="px-3 py-2"
                            >
                                <FaTrash />
                            </Button>
                        </div>
                    ) : (
                        /* Show Add to Cart for regular users or visitors */
                        <Button
                            onClick={handleAddToCart}
                            disabled={isVendor || product.quantity === 0 || isLoading}
                            className="w-full bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2"
                        >                
                            {isLoading ? <Loader /> : <><FaShoppingCart /> Add to Cart</>}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductCard;



