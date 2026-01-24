import AppError from "../utility/AppError.js";
import wrapAsync from "../utility/wrapAsync.js";
import Product from "../models/productSchema.js";
import Order from "../models/orderSchema.js";
import Vendor from "../models/vendorSchema.js";
import { JWT_SECRET } from "../config/env.config.js";
import { cloudinary } from "../config/cloudinary.js";
import mongoose from "mongoose";
const populateProductReviews = () => ({
  path: "reviews",
  populate: { path: "user", select: "name email" },
});

const populateProductVendor = () => ({
  path: "vendor",
  select: "name email description",
});

//add product by vendor
export const addProduct = wrapAsync(async (req, res) => {
  let product = {};

  // check if form-data "product" passed
  if (req.body.product) {
    try {
      product = JSON.parse(req.body.product);
    } catch (error) {
      throw new AppError("Invalid product JSON format.", 400);
    }
  } else {
    throw new AppError("Product data is required.", 400);
  }

  const vendorId = req.vendor?._id || req.user?._id;

  if (!vendorId) {
    throw new AppError("Vendor not found.", 404);
  }

  const vendorDoc = await Vendor.findById(vendorId);
  if (!vendorDoc) {
    throw new AppError("Vendor account not found", 404);
  }

  const newProduct = new Product({
    ...product,
    vendor: vendorId,
  });

  // Add image from cloudinary
  if (req.files && req.files.length > 0) {
    newProduct.images = req.files.map((file) => ({
      url: file.path,
      filename: file.filename,
    }));
  }
  console.log(newProduct);

  vendorDoc.productList.push(newProduct._id);
  await Promise.all([newProduct.save(), vendorDoc.save()]);
  res.status(201).json({
    success: "true",
    data: newProduct,
    message: "Product added successfully",
  });
});

//get all product
export const getAllProducts = wrapAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.page) || 20;
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find({ isActive: true })
      .populate(populateProductReviews())
      .populate(populateProductVendor())
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Product.countDocuments({ isActive: true }),
  ]);

  if (!products || products.length === 0) {
    throw new AppError("Products not found.", 404);
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

//get product by id
export const getProductById = wrapAsync(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  const product = await Product.findById(id)
    .populate(populateProductReviews())
    .populate(populateProductVendor());

  if (!product || !product.isActive) {
    throw new AppError("Products not found.", 404);
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

// Search product and pagination
export const searchProducts = wrapAsync(async (req, res) => {
  const {
    category,
    search,
    sort,
    minPrice,
    maxPrice,
    page = 1,
    limit = 12,
  } = req.query;
  const skip = (page - 1) * limit;

  const query = { isActive: true };

  // Category filter
  if (category) query.category = category;
  if (search) query.name = { $regex: search, $options: "i" };

  // Price range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const [products, total] = await Promise.all([
    Product.find(query)
      .skip(skip)
      .limit(Number(limit))
      .populate("vendor", "name email")
      .sort(sort === "price-asc" ? { price: 1 } : { createdAt: -1 }),
    Product.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      limit: Number(limit),
    },
  });
});

//update product by vendor
export const updateProduct = wrapAsync(async (req, res) => {
  const { id } = req.params;

  let productData = {};
  if (req.body.product) {
    try {
      productData = JSON.parse(req.body.product);
    } catch (error) {
      throw new AppError("Invalid product JSON format.", 400);
    }
  }

  const product = await Product.findById(id);

  console.log("✅ product routers loaded");
  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  if (product.vendor.toString() !== req.vendor._id.toString()) {
    throw new AppError("Not authorized to update this product", 403);
  }

  // update basic fields
  Object.assign(product, productData);

  const existingImages = req.body.existingImages
    ? JSON.parse(req.body.existingImages)
    : [];
  const uniqueImages = Array.from(
    new Map(
      existingImages.map((img) => [img.url + img.filename, img]),
    ).values(),
  );
  product.images = uniqueImages;

  // If new images uploaded, push to array
  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      const newImage = {
        url: file.path,
        filename: file.filename,
      };
      const exists = product.images.some(
        (img) => img.url === newImage.url && img.filename === newImage.filename,
      );
      if (!exists) product.images.push(newImage);
    });
  }

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
});

//delete product by vendor
export const deleteProduct = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  if (product.vendor.toString() !== req.vendor._id.toString()) {
    throw new AppError("Not authorized to delete this product", 403);
  }

  // Delete product images from cloudinary
  for (let img of product.images) {
    if (img.filename) {
      await cloudinary.uploader.destroy(img.filename);
    }
  }
  await Product.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Product deleted sucessfully",
  });
});
