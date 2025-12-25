import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import productReducer from "./slices/productSlice.js";
import orderReducer from "./slices/orderSlice.js";
import cartReducer from "./slices/cartSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    orders: orderReducer,
    cart: cartReducer,
  },
});

// if (process.env.NODE_ENV === "development") {
//   window.store = store;
// }

export default store;
