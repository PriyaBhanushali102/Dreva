import api from "./api";

// CART OPERATIONS
export const addToCart = async (prodId, quantity = 1) => {
  return await api.post(`/users/cart/${prodId}`, { quantity });
};

export const getCart = async () => {
  return await api.get("/users/cart");
};

export const updateCartItem = async (prodId, quantity) => {
  return await api.put(`/users/cart/${prodId}`, { quantity });
};
export const removeCartItem = async (prodId) => {
  return await api.delete(`/users/cart/${prodId}`);
};
export const removeFromCart = removeCartItem;

// WISHLIST OPERATIONS
export const addToWishList = async (prodId) => {
  return await api.post(`/users/wishlist/${prodId}`);
};

export const removeFromWishList = async (prodId) => {
  return await api.delete(`/users/wishlist/${prodId}`);
};

export const getWishList = async () => {
  return await api.get("/users/wishlist");
};
