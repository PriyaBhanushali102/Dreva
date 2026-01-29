import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  currentOrder: null,
  vendorOrders: [],
  isLoading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
      state.isLoading = false;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    setVendorOrders: (state, action) => {
      state.vendorOrders = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const index = state.vendorOrders.findIndex((o) => o._id === orderId);
      if (index !== -1) {
        state.vendorOrders[index].status = status;
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setOrders,
  setCurrentOrder,
  setVendorOrders,
  clearCurrentOrder,
  updateOrderStatus,
  setError,
} = orderSlice.actions;

export default orderSlice.reducer;
