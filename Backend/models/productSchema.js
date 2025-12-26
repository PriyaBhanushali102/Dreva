import mongoose from "mongoose";
import Vendor from "../models/vendorSchema.js";
import Review from "../models/reviewSchema.js";
import Order from "./orderSchema.js";
import User from "./userSchema.js";

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      min: [5, "too short name"],
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    images: [
      {
        url: String,
        filename: String,
      },
    ],
    description: {
      type: String,
      min: [20, "too short description."],
    },
    category: {
      type: String,
      enum: ["Home", "Fashion", "Toys", "Gadgets"],
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    reviews: {
      type: [Schema.Types.ObjectId],
      ref: "Review",
      default: [],
    },

    delivery: {
      type: String,
    },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

productSchema.pre("findOneAndDelete", async function (next) {
  try {
    console.log("PRE middleware triggered");
    const productId = await this.getQuery()._id;

    await mongoose.model("Review").deleteMany({ product: productId });

    await mongoose
      .model("Order")
      .updateMany({}, { $pull: { items: { product: productId } } });

    await mongoose
      .model("User")
      .updateMany({}, { $pull: { wishlist: productId } });

    next();
  } catch (error) {
    next(error);
  }
});

productSchema.index({ category: 1 });
productSchema.index({ vendor: 1 });
productSchema.index({ name: "text", description: "text" });

const Product = mongoose.model("Product", productSchema);
export default Product;
