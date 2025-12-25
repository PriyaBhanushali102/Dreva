import mongoose from "mongoose";
import Product from "./productSchema.js";
const Schema = mongoose.Schema;

const vendorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: [5, "Name is too short"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    image: {
      url: String,
      filename: String,
    },
    description: {
      type: String,
      min: [20, "Description is too short."],
    },
    productList: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    isVendor: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

vendorSchema.pre("findOneAndDelete", async function (next) {
  try {
    const vendor = await this.model.findOne(this.getFilter());
    if (vendor && vendor.productList && vendor.productList.length > 0) {
      await Product.deleteMany({ _id: { $in: vendor.productList } });
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Vendor = mongoose.model("Vendor", vendorSchema);
export default Vendor;
