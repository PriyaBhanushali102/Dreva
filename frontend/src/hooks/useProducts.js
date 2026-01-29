import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import * as productService from "../services/productService";

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);

  // Wrap fetchProducts in useCallback to prevent recreation on every render
  const fetchProducts = useCallback(
    async (reqPage = page) => {
      try {
        setLoading(true);

        const params = {
          search: filters.q,
          category: filters.category,
          brand: filters.brand,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          sort: filters.sort,
          page: reqPage,
          limit: filters.limit || 12,
        };

        // Remove empty/null/undefined values
        Object.keys(params).forEach(
          (k) =>
            (params[k] === "" ||
              params[k] === null ||
              params[k] === undefined) &&
            delete params[k],
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
          toast.error(
            error.response?.data?.message || "Failed to load products",
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [
      filters.q,
      filters.category,
      filters.brand,
      filters.minPrice,
      filters.maxPrice,
      filters.sort,
      filters.limit,
      page,
    ],
  ); // Include all filter values AND page

  // Fetch products when filters change (reset to page 1)
  useEffect(() => {
    setPage(1);
    fetchProducts(1); // Explicitly pass page 1
  }, [
    filters.q,
    filters.category,
    filters.brand,
    filters.minPrice,
    filters.maxPrice,
    filters.sort,
    filters.limit,
  ]); // Don't include fetchProducts here to avoid double-fetch

  // Fetch products when page changes (without filters changing)
  useEffect(() => {
    if (page > 1) {
      fetchProducts(page);
    }
  }, [page, fetchProducts]);

  return {
    products,
    loading,
    page,
    total,
    setPage,
    fetchProducts,
  };
};
