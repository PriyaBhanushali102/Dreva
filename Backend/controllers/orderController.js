import AppError from "../utility/AppError.js";
import wrapAsync from "../utility/wrapAsync.js";
import Product from "../models/productSchema.js";
import Order from "../models/orderSchema.js";
import User from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET, TAX_RATE } from "../config/env.config.js";
import { minimalOrder } from "../utility/minimalOrderRes.js";
import mongoose from "mongoose";
const key = JWT_SECRET;

const populateOrderDetails = () => ({
  path: "items.product",
  model: "Product",
  select: "name price brand quantity images",
});

//create order from cart
export const createOrder = wrapAsync(async (req, res) => {
  const token =
    req.cookies?.token ||
    req.headers.authorization?.split(" ")[1] ||
    req.headers.cookie?.split("token=")[1]?.split(";")[0];

  if (!token) {
    throw new AppError("Please login to place order.", 401);
  } // Decoded token

  const decoded = jwt.verify(token, key);

  const user = await User.findOne({ email: decoded.email }).populate(
    "cart.product",
  );
  if (!user) {
    throw new AppError("User not found.", 404);
  } // If cart is in DB

  const cartItems = user.cart || [];
  if (!cartItems || cartItems.length === 0) {
    throw new AppError("Cart is empty.", 400);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    //calculate total and prepare order
    let total = 0;
    const orderItems = [];
    const InsufficientProducts = [];

    const vendorGroups = {};

    for (const item of cartItems) {
      const product = item.product;
      if (!product) {
        InsufficientProducts.push({
          name: "unknown product",
          reason: "product not found",
        });
        continue;
      } //check availability

      if (!product.quantity || product.quantity < item.quantity) {
        InsufficientProducts.push({
          name: product.name,
          requested: item.quantity,
          available: product.quantity || 0,
          reason: "Insufficient stock",
        });
        continue;
      } //update product qty in DB

      product.quantity -= item.quantity;
      await product.save({ session });

      const vendorId = product.vendor.toString(); // Group by vendor

      if (!vendorGroups[vendorId]) {
        vendorGroups[vendorId] = [];
      }

      vendorGroups[vendorId].push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        vendor: product.vendor,
      });

      total += product.price * item.quantity;
    }

    if (InsufficientProducts.length > 0) {
      await session.abortTransaction();
      throw new AppError("Some products are unavailable", 400);
    } //now apply tax to order

    const tax = Math.round(total * TAX_RATE);
    const finalTotal = total + tax;

    const createdOrders = [];
    for (const [vendorId, items] of Object.entries(vendorGroups)) {
      //create order
      const order = await Order.create(
        [
          {
            items: items,
            customer: user._id,
            vendor: vendorId,
            total: finalTotal,
            status: "Processing",
            subtotal: total,
            tax: tax,
            createdAt: Date.now(),
          },
        ],
        { session },
      );
      createdOrders.push(order[0]);
      user.orderHistory.push(order[0]._id);
    } // Clear cart in DB

    user.cart = [];
    await user.save({ session }); // Commit transaction

    await session.commitTransaction();

    const totalQuantity = createdOrders.reduce(
      (acc, order) =>
        acc + order.items.reduce((sum, item) => sum + item.quantity, 0),
      0,
    );

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: {
        customer: user._id,
        quantity: totalQuantity,
        total: finalTotal,
        orders: createdOrders.map((o) => ({
          orderId: o._id,
          status: o.status,
        })),
        subtotal: total,
        tax,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

//get order confirmation
export const getOrderConfirmation = wrapAsync(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id)
    .populate("customer", "name email ")
    .populate(populateOrderDetails());

  if (!order) {
    throw new AppError("Order not found.", 404);
  }

  res.status(200).json({
    success: true,
    data: minimalOrder(order),
    title: "Order confirmation",
  });
});

//get user's orders history
export const getUserOrders = wrapAsync(async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({
      customer: userId,
      isActive: true,
    })
      .populate("items.product", "name price brand quantity images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments({ customer: userId, isActive: true }),
  ]);

  if (!orders || orders.length === 0) {
    return res.status(200).json({
      success: true,
      data: [],
      pagination: { total: 0, page, pages: 0, limit },
    });
  }

  res.status(200).json({
    success: true,
    customer: {
      name: req.user.name,
      email: req.user.email,
    },
    data: orders.map((o) => minimalOrder(o)),
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  });
});

//get order by id
export const getOrderById = wrapAsync(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findOne({ _id: id, isActive: true })
    .populate("customer", "name email")
    .populate(populateOrderDetails());

  if (!order) {
    throw new AppError("Order not found.", 404);
  } //check if user is authorized to view this order

  const isCustomer = order.customer._id.toString() === req.user._id.toString();

  if (!isCustomer) {
    throw new AppError("Not authorized to access this order.", 403);
  }

  const minimalOrderObj = minimalOrder(order);

  res.status(200).json({
    success: true,
    data: minimalOrderObj,
  });
});

//get vendor's orders for all products
export const getVendorOrders = wrapAsync(async (req, res) => {
  const vendor = req.vendor;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit; //get all order that contains vendor's product

  const [orders, total] = await Promise.all([
    Order.find({
      "items.vendor": req.vendor._id,
    })
      .populate("customer", "name email")
      .populate(populateOrderDetails())
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments({ "items.vendor": req.vendor._id }),
  ]);

  const vendorOrders = orders.map((order) => {
    const vendorItems = order.items.filter(
      (item) => item.vendor.toString() === vendor._id.toString(),
    );

    return {
      ...order.toObject(),
      items: vendorItems,
    };
  });

  res.status(200).json({
    success: true,
    data: vendorOrders,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  });
});

//update order
export const updateOrderStatus = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["Processing", "Shipped", "Delivered"];
  if (!validStatuses.includes(status)) {
    throw new AppError("Invalid order status.", 400);
  }

  const order = await Order.findById(id);

  if (!order) {
    throw new AppError("Order not found.", 404);
  } // Check if vendor owns this order

  const hasVendorItems = order.items.some(
    (item) => item.vendor.toString() === req.vendor._id.toString(),
  );

  if (!hasVendorItems) {
    throw new AppError("Not authorized to update this order", 403);
  }

  order.status = status;
  await order.save();

  res.status(200).json({
    success: true,
    data: minimalOrder(order),
  });
});

//cancel order
export const deleteOrder = wrapAsync(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    throw new AppError("Order not found.", 404);
  } // Check if user owns this order

  if (order.customer.toString() !== req.user._id.toString()) {
    throw new AppError("Not authorized to delete this order", 403);
  } // Only allow cancellation if order is still processing

  if (order.status !== "Processing") {
    throw new AppError(
      "Cannot cancel order that is already shipped or delivered.",
      400,
    );
  }

  const deleteOrder = await Order.findByIdAndUpdate(
    id,
    { isActive: false, deletedAt: Date.now() },
    { new: true },
  );

  res.status(200).json({
    success: true,
    message: "Order deleted successfully.",
  });
});
