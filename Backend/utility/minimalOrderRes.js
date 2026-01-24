import mongoose from "mongoose";
export const minimalOrder = (order) => {
  const totalQuantity = order.items.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0,
  );

  return {
    _id: order._id,
    total: order.total,
    status: order.status,
    subtotal: order.subtotal,
    tax: order.tax,
    quantity: totalQuantity,

    items: order.items.map((item) => ({
      productId: item.product?._id || item.product,
      name: item.product?.name || "unknown",
      price: item.product?.price || 0,
      quantity: item.quantity || 0,
      image: item.product?.images?.[0]?.url || null,
    })),
    createdAt: order.createdAt,
  };
};
