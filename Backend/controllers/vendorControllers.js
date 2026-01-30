import AppError from "../utility/AppError.js";
import wrapAsync from "../utility/wrapAsync.js";
import Vendor from "../models/vendorSchema.js";
import Product from "../models/productSchema.js";
import Review from "../models/reviewSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { vendorvalidatorSchema } from "../utility/vendorvalidator.js";
import { JWT_SECRET, JWT_EXPIRATION } from "../config/env.config.js";

//register new vendor
export const registerVendor = wrapAsync(async (req, res) => {
  let vendor = req.body;

  const { error } = vendorvalidatorSchema.validate(vendor);
  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    throw new AppError(errorMessage, 400);
  } //check if alreadyexsist

  const exsistingVendor = await Vendor.findOne({ email: vendor.email });
  if (exsistingVendor) {
    throw new AppError("Vendor with this email already exists.", 400);
  } //hash password

  const salt = await bcrypt.genSalt(10);
  vendor.password = await bcrypt.hash(vendor.password, salt); // Add image from cloudinary

  if (req.file) {
    vendor.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  } //create vendor

  const newVendor = await Vendor.create(vendor); //generate jwt token

  const token = jwt.sign(
    { email: newVendor.email, isVendor: true },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRATION,
    },
  ); //store token in cookie

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    sameSite: "none",
  }); //remove pass from response

  const vendorResponse = newVendor.toObject();
  delete vendorResponse.password;
  console.log(vendorResponse);
  res.status(200).json({
    success: true,
    token,
    data: vendorResponse,
  });
});

export const loginVendor = wrapAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required.", 400);
  } //find vendor
  const vendor = await Vendor.findOne({ email });
  if (!vendor) {
    throw new AppError("Vendor not found.", 404);
  } //verify password

  const validPassword = await bcrypt.compare(password, vendor.password);
  if (!validPassword) {
    throw new AppError("Invalid vendor credentials.", 401);
  } //generate jwt token

  const token = jwt.sign({ email: vendor.email, isVendor: true }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  }); // Set token in cookie

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  }); //remove password from response

  const vendorResponse = vendor.toObject();
  delete vendorResponse.password;

  res.status(200).json({
    success: true,
    token,
    data: vendorResponse,
  });
});

//logout vendor
export const logoutVendor = wrapAsync(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    samesite: "none",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});

export const getVendorProfile = wrapAsync(async (req, res) => {
  const vendor = await Vendor.findById(req.vendor._id)
    .select("-password")
    .populate("productList");

  if (!vendor) {
    throw new AppError("Vendor not found.", 404);
  }

  res.status(200).json({
    success: true,
    data: vendor,
  });
});

export const getVendorProduct = wrapAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find({ vendor: req.vendor._id, isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Product.countDocuments({ vendor: req.vendor._id, isActive: true }),
  ]);

  if (!products) {
    throw new AppError("No products found", 404);
  }

  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  });
});

export const updateVendor = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body; //prevent password from update

  if (updates.password) {
    delete updates.password;
  }

  const vendor = await Vendor.findById(id);

  if (!vendor) {
    throw new AppError("Vendor not found.", 404);
  } //check if the update vendor is same as authenticate vendor

  if (vendor.email !== req.vendor.email) {
    throw new AppError("Not authorized to update profile.", 403);
  }

  if (req.file) {
    vendor.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  } //update vendor fields

  Object.keys(updates).forEach((key) => {
    vendor[key] = updates[key];
  });
  await vendor.save(); //remove password from response

  const vendorResponse = vendor.toObject();
  delete vendorResponse.password;

  res.status(200).json({
    success: true,
    data: vendorResponse,
  });
});
export const deleteVendor = wrapAsync(async (req, res) => {
  const vendor = await Vendor.findById(req.vendor._id);

  if (!vendor) {
    throw new AppError("Vendor not found.", 404);
  }

  await Vendor.findByIdAndDelete(req.vendor._id);

  res.status(200).json({
    success: true,
    message: "Vendor account is deleted sucessfully",
  });
});

export const getVendorReviews = wrapAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit; //find all product by this vendor

  const products = await Product.find({ vendor: req.vendor._id });

  if (!products || products.length === 0) {
    return res.status(200).json({
      success: true,
      data: [],
      pagination: {
        total: 0,
        page,
        pages: 0,
        limit,
      },
    });
  } //get product ids

  const productIds = products.map((product) => product._id); //find all reviews for these products

  const [reviews, total] = await Promise.all([
    Review.find({ product: { $in: productIds } })
      .populate("user", "name")
      .populate("product", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Review.countDocuments({ product: { $in: productIds } }),
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
