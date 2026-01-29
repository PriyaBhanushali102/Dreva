import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as productService from "../services/productService";
import { Link } from "react-router-dom";

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(2);
  const [total, setTotal] = useState(null);

  const fetchProducts = async (reqPage = page) => {
    try {
      setLoading(true);

      const params = {
        search: filters.q,
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sort: filters.sort,
        page: reqPage,
        limit: filters.limit,
      };

      Object.keys(params).forEach(
        (k) => (params[k] === "" || params[k] === null) && delete params[k]
      );

      const response = await productService.searchProducts(params);
      const { data, pagination } = response.data;

      if (Array.isArray(data)) {
        setProducts(data);
        setTotal(pagination?.total || data.length);
      } else {
        setProducts([]);
        setTotal(0);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login to view this product");
      } else {
        toast.error(error.response?.data?.message || "Failed to load products");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchProducts(1);
  }, [
    filters.q,
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.sort,
    filters.limit,
  ]);

  return {
    products,
    loading,
    page,
    total,
    setPage,
    fetchProducts,
  };
};
