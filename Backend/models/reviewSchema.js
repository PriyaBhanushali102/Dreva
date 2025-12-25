import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
    images: [
      {
        url: String,
        filename: String,
      },
    ],
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      index: true,
    },
    productName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Compound index for better query performance
reviewSchema.index({ product: 1, user: 1 });
reviewSchema.index({ product: 1, createdAt: -1 });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
