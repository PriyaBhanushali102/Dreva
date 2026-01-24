import mongoose from "mongoose";
import Product from "./productSchema.js";
import Order from "./orderSchema.js";
import Review from "./reviewSchema.js";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: [5, "too short name"],
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      url: String,
      filename: String,
    },
    addresses: [
      {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
      },
    ],
    cart: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
      },
    ],
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    orderHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    productReviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

userSchema.pre("findOneAndDelete", async function (next) {
  try {
    const user = await this.model.findOne(this.getFilter());
    if (user && user.productReviews && user.productReviews.length > 0) {
      await Review.deleteMany({ _id: { $in: user.productReviews } });
    }
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.index({ "cart.product": 1 });

const User = mongoose.model("User", userSchema);
export default User;
