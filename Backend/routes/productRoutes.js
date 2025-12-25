import express from "express";
//import productController from "../controllers/productController";
import {
  addProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { vendorProtect } from "../middlewares/vendorProtect.js";
import { upload } from "../config/multer.js";

const router = express.Router();

const inCategory = (req, res, next) => {
  let { category } = req.params;
  let validCategory = ["Home", "Fashion", "Toys", "Gadgets"];

  if (validCategory.includes(category)) {
    return next();
  }
  return res.status(400).json({
    success: false,
    error: "Invalid category.",
  });
};

//add product by vendor
router.post("/create", upload.array("images", 5), vendorProtect, addProduct);

//get product by category
router.get("/category/:category", inCategory, getProductsByCategory);

// Search product and pagination
router.get("/search", searchProducts);

//get product by id
router.get("/:id", getProductById);

//update product by vendor
router.put("/:id", vendorProtect, upload.array("images"), updateProduct);

//delete product by vendor
router.delete("/:id", vendorProtect, deleteProduct);

//get all product
router.get("/", getAllProducts);

export default router;
