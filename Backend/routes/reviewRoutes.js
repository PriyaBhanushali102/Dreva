import express from "express";
import {
  createReview,
  getReviewsByProduct,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { userProtect } from "../middlewares/userProtect.js";
import { upload } from "../config/multer.js";
const router = express.Router();

//create review
router.post(
  "/new/:prodId",
  userProtect,
  upload.array("images", 5),
  createReview
);

//get all reviews by productId
router.get("/product/:prodId", userProtect, getReviewsByProduct);

//update review
router.put("/:id", userProtect, upload.array("images", 5), updateReview);

//delete review
router.delete("/:id", userProtect, deleteReview);

export default router;
