import { useSelector, useDispatch } from "react-redux";
import {
  setCart,
  setLoading,
  clearCart as clearCartAction,
} from "../store/slices/cartSlice";
import * as cartService from "../services/cartService";
import toast from "react-hot-toast";
import { useCallback, useEffect } from "react";

export const useCart = () => {
  const dispatch = useDispatch();
  const { items, total, itemCount, isLoading } = useSelector(
    (state) => state.cart,
  );
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      dispatch(setLoading(true));
      const response = await cartService.getCart();

      const cartData = response.data?.data || response.data;
      dispatch(
        setCart({
          items: cartData.dbCart || cartData.items || [],
          total: cartData.total || 0,
        }),
      );
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated, fetchCart]);

  const addToCart = async (prodId, quantity = 1) => {
    try {
      dispatch(setLoading(true));

      const response = await cartService.addToCart(prodId, quantity);
      const cartData = response.data?.data || response.data;

      dispatch(
        setCart({
          items: cartData.dbCart || cartData.items || [],
          total: cartData.total || 0,
        }),
      );
      toast.success("Added to cart!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add to cart";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateQuantity = async (prodId, quantity) => {
    if (quantity < 1) {
      toast.error("Quantity must be at least 1");
      return { success: false };
    }

    try {
      dispatch(setLoading(true));

      await cartService.updateCartItem(prodId, quantity);

      await fetchCart();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update cart";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const removeFromCart = async (prodId) => {
    try {
      dispatch(setLoading(true));
      await cartService.removeFromCart(prodId);
      await fetchCart();

      toast.success("Item removed from cart");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to remove item";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const clearCart = () => {
    dispatch(clearCartAction());
    toast.success("Cart cleared");
  };

  // UTILITIES
  const isInCart = (prodId) => {
    return items.some((item) => item._id === prodId);
  };

  const getItemQuantity = (prodId) => {
    const cartItem = items.find((item) => item._id === prodId);
    return cartItem ? cartItem.quantity : 0;
  };

  const getCartSummary = () => {
    const count = items.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0,
    );
    const total = items.reduce(
      (sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0),
      0,
    );
    // const count = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    return { total, itemCount: count };
  };

  const isEmpty = items.length === 0;

  return {
    // State
    items,
    total,
    itemCount,
    isLoading,
    isEmpty,

    // Actions
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,

    // Utilities
    isInCart,
    getItemQuantity,
    getCartSummary,
  };
};
