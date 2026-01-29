import api from "./api";

export const createCheckoutSession = async (orderData) => {
  return await api.post("/payments/create-checkout-session", orderData);
};
