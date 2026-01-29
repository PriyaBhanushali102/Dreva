import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  currentProduct: null,

  // Pagination
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },

  // Filters
  filters: {
    category: "",
    minPrice: "",
    maxPrice: "",
    q: "",
  },

  isLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setProducts: (state, action) => {
      state.items = action.payload;
      state.isLoading = false;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
      state.error = null;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    clearFilters: (state) => {
      state.filters = {
        category: "",
        minPrice: "",
        maxPrice: "",
        q: "",
      };
      state.pagination.page = 1;
    },
    addProduct: (state, action) => {
      state.items.unshift(action.payload);
      state.pagination.page = 1;
    },
    updateProduct: (state, action) => {
      const index = state.items.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }

      if (state.currentProduct?.id === action.payload._id) {
        state.currentProduct = action.payload;
      }
    },
    removeProduct: (state, action) => {
      state.items = state.items.filter((p) => p._id !== action.payload);
      state.pagination.total = Math.max(0, state.pagination.total - 1);

      if (state.currentProduct?.id === action.payload) {
        state.currentProduct = null;
      }
    },

    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    resetProducts: (state) => {
      state.items = [];
      state.currentProduct = null;
      state.pagination = {
        page: 1,
        limit: 12,
        total: 0,
        pages: 0,
      };
      state.filters = {
        category: "",
        minPrice: "",
        maxPrice: "",
        q: "",
      };
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setProducts,
  setCurrentProduct,
  setPagination,
  setFilters,
  clearFilters,
  addProduct,
  updateProduct,
  removeProduct,
  setPage,
  resetProducts,
} = productSlice.actions;

export default productSlice.reducer;
