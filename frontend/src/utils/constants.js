// Product Categories
export const CATEGORIES = [
  { value: "Home & Living", label: "Home & Living" },
  { value: "Fashion", label: "Fashion" },
  { value: "Beauty", label: "Beauty" },
  { value: "Accessories", label: "Accessories" },
];

// Payment Methods
export const PAYMENT_METHODS = [
  { value: "COD", label: "Cash on Delivery" },
  { value: "Card", label: "Credit/Debit Card" },
  { value: "UPI", label: "UPI Payment" },
];

// Order Status Colors
export const ORDER_STATUS_COLORS = {
  Processing: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  Shipped: "bg-blue-100 text-blue-800 border border-blue-300",
  Delivered: "bg-green-100 text-green-800 border border-green-300",
};

// Order Statuses
export const ORDER_STATUSES = ["Processing", "Shipped", "Delivered"];

// Pagination Defaults
export const DEFAULT_PAGE_SIZE = 12;
export const DEFAULT_PAGE = 1;

// API Base URL
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Image Limits
export const MAX_PRODUCT_IMAGES = 5;
export const MAX_REVIEW_IMAGES = 5;

// Validation Rules
export const VALIDATION = {
  MIN_NAME_LENGTH: 5,
  MIN_DESCRIPTION_LENGTH: 20,
  MIN_PASSWORD_LENGTH: 8,
  MAX_IMAGE_SIZE_MB: 5,
};

// Tax Rate
export const TAX_RATE = 0.18; // 18%
