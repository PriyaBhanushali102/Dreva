import express from "express";
const router = express.Router();
import {
  registerVendor,
  loginVendor,
  logoutVendor,
  getVendorProfile,
  getVendorProduct,
  updateVendor,
  deleteVendor,
  getVendorReviews,
} from "../controllers/vendorControllers.js";
import { vendorProtect } from "../middlewares/vendorProtect.js";
import { upload } from "../config/multer.js";

//register vendor
router.post("/register", upload.single("image"), registerVendor);

//login vendor
router.post("/login", loginVendor);

//logout vendor
router.get("/logout", logoutVendor);

//get vendor profile
router.get("/profile", vendorProtect, getVendorProfile);

//get vendor products
router.get("/product", vendorProtect, getVendorProduct);

//get vendors review
router.get("/reviews", vendorProtect, getVendorReviews);

//delete vendor profile
router.delete("/delete", vendorProtect, deleteVendor);

//update vendor profile
router.put("/:id", upload.single("image"), vendorProtect, updateVendor);

export default router;
