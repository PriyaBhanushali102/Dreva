import { createSlice } from "@reduxjs/toolkit";

const savedCart = JSON.parse(localStorage.getItem("cart_items")) || [];
const savedTotal = Number(localStorage.getItem("cart_total")) || 0;

const initialState = {
  items: savedCart,
  total: savedTotal,
  itemCount: savedCart.reduce((sum, item) => sum + (item.quantity || 0), 0),
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setCart: (state, action) => {
      const items = action.payload.items || [];
      const total = action.payload.total || 0;

      state.items = items;
      state.total = total;
      state.itemCount = items.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0,
      );
      state.isLoading = false;

      // Persist to localStorage
      localStorage.setItem("cart_items", JSON.stringify(items));
      localStorage.setItem("cart_total", total);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      localStorage.removeItem("cart_items");
      localStorage.removeItem("cart_total");
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setLoading, setCart, clearCart, setError } = cartSlice.actions;

export default cartSlice.reducer;
