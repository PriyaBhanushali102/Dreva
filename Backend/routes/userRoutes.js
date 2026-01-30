import express from "express";
import {
  register,
  loginUser,
  logoutUser,
  addToCart,
  getCart,
  getUserProfile,
  updateUser,
  updateCartItem,
  removeCartItem,
} from "../controllers/userController.js";
import { userProtect } from "../middlewares/userProtect.js";
import { optionalAuth } from "../middlewares/optionalAuth.js";
import { upload } from "../config/multer.js";
const router = express.Router();

// Auth routes
router.post("/register", upload.single("images"), register);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

// User profile
router.get("/profile", userProtect, getUserProfile);
router.put("/:userId", upload.single("images"), userProtect, updateUser);

// Cart routes
router.get("/cart", optionalAuth, getCart);
router.post("/cart/:prodId", userProtect, addToCart);
router.put("/cart/:prodId", userProtect, updateCartItem);
router.delete("/cart/:prodId", userProtect, removeCartItem);

export default router;
