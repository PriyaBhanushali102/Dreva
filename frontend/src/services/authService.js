import api from "./api";

// USER AUTH
export const registerUser = async (userData) => {
  const formData = new FormData();

  formData.append("name", userData.name);
  formData.append("email", userData.email);
  formData.append("password", userData.password);

  if (userData.image) {
    formData.append("image", userData.image);
  }

  // Make API call
  return await api.post("/users/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const loginUser = async (credentials) => {
  return await api.post("/users/login", credentials);
};

export const logoutUser = async () => {
  return await api.get("/users/logout");
};

export const getUserProfile = async () => {
  return await api.get("/users/profile");
};

export const updateUser = async (userId, userData) => {
  const formData = new FormData();

  if (userData.name) formData.append("name", userData.name);
  if (userData.email) formData.append("email", userData.email);
  if (userData.password) formData.append("password", userData.password);
  if (userData.image) formData.append("image", userData.image);
  if (userData.addresses)
    formData.append("addresses", JSON.stringify(userData.addresses));

  return await api.put(`/users/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// VENDOR AUTH
export const registerVendor = async (vendorData) => {
  const formData = new FormData();

  formData.append("name", vendorData.name);
  formData.append("email", vendorData.email);
  formData.append("password", vendorData.password);
  formData.append("description", vendorData.description);

  if (vendorData.image) {
    formData.append("image", vendorData.image);
  }

  return await api.post("/vendors/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const loginVendor = async (credentials) => {
  return await api.post("/vendors/login", credentials);
};

export const logoutVendor = async () => {
  return await api.get("/vendors/logout");
};

export const getVendorProfile = async () => {
  return await api.get("/vendors/profile");
};

export const getVendorProduct = async () => {
  return await api.get("/vendors/product");
};

export const getVendorReviews = async () => {
  return await api.get("/vendors/reviews");
};

export const updateVendor = async (vendorId, vendorData) => {
  const formData = new FormData();

  if (vendorData.name) formData.append("name", vendorData.name);
  if (vendorData.email) formData.append("email", vendorData.email);
  if (vendorData.password) formData.append("password", vendorData.password);
  if (vendorData.image) formData.append("image", vendorData.image);
  if (vendorData.description)
    formData.append("description", vendorData.description);

  return await api.put(`/vendors/${vendorId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteVendor = async () => {
  return await api.delete("/vendors/delete");
};
