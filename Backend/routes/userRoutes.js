import express from "express";
//import userController from "../controllers/userController";
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
  addToWishList,
  removeFromWishList,
  getWishList,
} from "../controllers/userController.js";
import { userProtect } from "../middlewares/userProtect.js";
import { optionalAuth } from "../middlewares/optionalAuth.js";
import { upload } from "../config/multer.js";
const router = express.Router();

// Auth routes
router.post("/register", upload.single("image"), register);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

// User profile
router.get("/profile", userProtect, getUserProfile);
router.put("/:userId", upload.single("image"), userProtect, updateUser);

// Cart routes
router.get("/cart", optionalAuth, getCart);
router.post("/cart/:prodId", userProtect, addToCart);
router.put("/cart/:prodId", userProtect, updateCartItem);
router.delete("/cart/:prodId", userProtect, removeCartItem);

// Wishlist routes
router.get("/wishlist", userProtect, getWishList);
router.post("/wishlist/:prodId", userProtect, addToWishList);
router.delete("/wishlist/:prodId", userProtect, removeFromWishList);

// ADD ADDRESS ROUTE LATER

export default router;
