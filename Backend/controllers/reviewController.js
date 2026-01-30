import AppError from "../utility/AppError.js";
import wrapAsync from "../utility/wrapAsync.js";
import Product from "../models/productSchema.js";
import User from "../models/userSchema.js";
import Review from "../models/reviewSchema.js";
import { cloudinary } from "../config/cloudinary.js";

export const createReview = wrapAsync(async (req, res) => {
  const { prodId } = req.params;
  const { rating, comment } = req.body; // Check if product exists

  const product = await Product.findById(prodId);
  if (!product) {
    throw new AppError("Products not found.", 404);
  }

  const newReview = new Review({
    rating,
    comment,
    productName: product.name,
    user: req.user._id,
    product: prodId,
  }); // Add uploaded images

  if (req.files && req.files.length > 0) {
    newReview.images = req.files.map((file) => ({
      url: file.path,
      filename: file.filename,
    }));
  }

  await newReview.save();

  product.reviews.push(newReview._id);
  await product.save(); // push review id into user

  await User.findByIdAndUpdate(
    req.user._id,
    { $push: { productReviews: newReview._id } },
    { new: true },
  );

  res.status(201).json({
    success: true,
    message: "Reviewed successfully.",
    review: newReview,
  });
});

export const getReviewsByProduct = wrapAsync(async (req, res) => {
  const { prodId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const product = await Product.findById(prodId);
  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  const [reviews, total] = await Promise.all([
    Review.find({ product: prodId, isActive: true })
      .populate("user", "name email image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Review.countDocuments({ product: prodId, isActive: true }),
  ]);

  res.status(200).json({
    success: true,
    data: reviews,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  });
});

export const updateReview = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  const review = await Review.findById(id);

  if (!review) {
    throw new AppError("Review not found.", 404);
  }

  if (
    !review.user ||
    !req.user._id ||
    review.user.toString() !== req.user._id.toString()
  ) {
    throw new AppError("Not authorized", 403);
  }

  review.rating = rating || review.rating;
  review.comment = comment || review.comment; // Append new images if uploaded

  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((file) => ({
      url: file.path,
      filename: file.filename,
    }));
    review.images.push(...newImages);
  }

  await review.save();

  res.status(200).json({
    success: true,
    message: "Review updated",
    review,
  });
});

export const deleteReview = wrapAsync(async (req, res) => {
  const { id } = req.params;

  const review = await Review.findById(id);
  if (!review) {
    throw new AppError("Review not found.", 404);
  } // Check authorization

  if (
    !review.user ||
    !req.user._id ||
    review.user.toString() !== req.user._id.toString()
  ) {
    throw new AppError("Not authorized", 403);
  }

  if (review.images && review.images.length > 0) {
    for (const img of review.images) {
      try {
        await cloudinary.uploader.destroy(img.filename);
      } catch (error) {
        console.error(`Failed to delete image ${img.filename}:`, error);
      }
    }
  } // Remove review from product

  await Product.findByIdAndUpdate(review.product, {
    $pull: { reviews: review._id },
  }); // Remove review reference from User

  await User.findByIdAndUpdate(review.user, {
    $pull: { productReviews: review._id },
  }); // Review deleted

  await Review.findByIdAndDelete(id);

  res
    .status(200)
    .json({ success: true, message: "Review deleted successfully." });
});
