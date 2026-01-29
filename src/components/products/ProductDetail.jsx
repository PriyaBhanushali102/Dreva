import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../hooks/useCart";
import { useProduct } from "../../hooks/useProduct";
import toast from "react-hot-toast";
import { Loader, Button } from "../index";

function ProductDetail() {
  const { id } = useParams();

  const { addToCart, isLoading: cartLoading } = useCart();
  const { product, isLoading, error } = useProduct(id);


  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (isLoading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-gray-500">
        Product not available
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product._id, 1);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* LEFT: Image */}
      <div className="border rounded-lg p-4">
        <img
          src={product.images?.[0]?.url || "/placeholder.jpg"}
          alt={product.name}
          className="w-full h-[400px] object-contain"
        />
      </div>

      {/* RIGHT: Info */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {product.name}
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={
                  i < Math.floor(product.rating || 0)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">
            ({product.reviews?.length || 0} reviews)
          </span>
        </div>

        {/* Price */}
        <p className="text-2xl font-semibold text-black mb-4">
          ₹{product.price}
        </p>

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          {product.description}
        </p>

        {/* Add to Cart */}
        <Button
          type="button"
          onClick={handleAddToCart}
          disabled={cartLoading || product.quantity === 0}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition"
        >
          <FaShoppingCart />
          {cartLoading ? <Loader /> : "Add to Cart"}
        </Button>

        {product.quantity === 0 && (
          <p className="text-red-500 mt-2 font-medium">
            Out of stock
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
