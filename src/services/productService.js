import api from "./api";

export const addProduct = async (productData) => {
  const formData = new FormData();

  const productJson = {
    name: productData.name,
    brand: productData.brand,
    description: productData.description,
    category: productData.category,
    quantity: productData.quantity,
    price: productData.price,
  };

  formData.append("product", JSON.stringify(productJson));

  if (productData.images && productData.images.length > 0) {
    productData.images.forEach((image) => {
      formData.append("images", image);
    });
  }

  return await api.post("/products/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getProductsByCategory = async (category) => {
  return api.get(`/products/category/${category}`);
};

export const getProductById = async (prodId) => {
  return api.get(`/products/${prodId}`);
};

export const searchProducts = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.q) queryParams.append("q", filters.q);
  if (filters.category) queryParams.append("category", filters.category);
  if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
  if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);
  if (filters.sort) queryParams.append("sort", filters.sort);
  if (filters.page) queryParams.append("page", filters.page);
  if (filters.limit) queryParams.append("limit", filters.limit);

  const queryString = queryParams.toString();
  return await api.get(`/products/search?${queryString}`);
};

export const updateProduct = async (prodId, productData) => {
  const formData = new FormData();

  const productJson = {};

  if (productData.name) productJson.name = productData.name;
  if (productData.brand) productJson.brand = productData.brand;
  if (productData.description)
    productJson.description = productData.description;
  if (productData.category) productJson.category = productData.category;
  if (productData.quantity !== undefined)
    productJson.quantity = productData.quantity;
  if (productData.price !== undefined) productJson.price = productData.price;

  formData.append("product", JSON.stringify(productJson));

  if (productData.images && productData.images.length > 0) {
    productData.images.forEach((image) => {
      formData.append("images", image);
    });
  }

  return await api.put(`/products/${prodId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProduct = async (prodId) => {
  return await api.delete(`/products/${prodId}`);
};

export const getAllProducts = async (params = {}) => {
  return await api.get("/products", { params });
};
