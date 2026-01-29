// Format
export const formatPrice = (price) => {
  if (!price) return "₹0";
  return `₹${price.toLocaleString("en-IN")}`;
};

export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  };
  return new Date(date).toLocaleDateString("en-IN", defaultOptions);
};

export const getOrderStatusColor = (status) => {
  const colors = {
    Processing: "bg-yellow-100",
    Shipped: "bg-blue-100",
    Delivered: "bg-green-100",
  };
  return colors[status];
};

export const truncateText = (text, maxLength) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.subString(0, maxLength) + "...";
};
export const getImageUrl = (url) => {
  return url || "/placeholder.jpg";
};
