import * as productService from "../services/productService";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

export const useProduct = (prodId) => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProduct = async () => {
    if (!prodId) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await productService.getProductById(prodId);
      setProduct(response.data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login to view this product");
      } else {
        const message =
          error.response?.data?.message || "Failed to load product";
        setError(message);
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [prodId]);

  return {
    product,
    isLoading,
    error,
    refetch: fetchProduct,
  };
};
