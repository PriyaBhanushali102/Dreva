import api from "./api";

export const createReview = async (prodId, reviewData) => {
  const formData = new FormData();

  formData.append("rating", reviewData.rating);
  formData.append("comment", reviewData.comment);

  if (reviewData.images && reviewData.images.length > 0) {
    reviewData.images.forEach((image) => {
      formData.append("images", image);
    });
  }

  return await api.post(`/reviews/new/${prodId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getByProductId = async (prodId) => {
  return await api.get(`/reviews/product/${prodId}`);
};

export const updateReview = async (reviewId, reviewData) => {
  const formData = new FormData();

  if (reviewData.rating !== undefined)
    formData.append("rating", reviewData.rating);
  if (reviewData.comment !== undefined)
    formData.append("comment", reviewData.comment);

  if (reviewData.images && reviewData.images.length > 0) {
    reviewData.images.forEach((img) => {
      formData.append("images", img);
    });
  }

  return await api.put(`/reviews/${reviewId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteReview = async (reviewId) => {
  return await api.delete(`/reviews/${reviewId}`);
};
