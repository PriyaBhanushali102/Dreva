import api from "./api";

export const createOrder = async (orderData) => {
  return await api.post("/orders/create", orderData);
};

export const getOrderConfirmation = async (orderId) => {
  return await api.get(`/orders/confirmation/${orderId}`);
};

export const getUserOrders = async () => {
  return await api.get(`/orders/history`);
};

export const getOrderById = async (orderId) => {
  return await api.get(`/orders/${orderId}`);
};

export const getVendorOrders = async (params = {}) => {
  return await api.get("/orders/vendor", { params });
};

export const updateOrderStatus = async (orderId, status) => {
  return await api.put(`/orders/${orderId}/status`, { status });
};

export const deleteOrder = async (orderId) => {
  return await api.delete(`/orders/${orderId}`);
};
