import express from "express";
const router = express.Router();
//import orderController from "../controllers/orderController";
import { userProtect } from "../middlewares/userProtect.js";
import { vendorProtect } from "../middlewares/vendorProtect.js";
import {
  createOrder,
  getOrderConfirmation,
  getUserOrders,
  getOrderById,
  getVendorOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";

//new order - user
router.post("/create", userProtect, createOrder);

//get order confirmation
router.get("/confirmation/:id", userProtect, getOrderConfirmation);

//get users order history
router.get("/history", userProtect, getUserOrders);

//get vendor order
router.get("/vendor", vendorProtect, getVendorOrders);

//get order by id
router.get("/:id", userProtect, getOrderById);

//cancel order
router.delete("/:id", userProtect, deleteOrder);

//update order status
router.put("/:id/status", vendorProtect, updateOrderStatus);

export default router;
