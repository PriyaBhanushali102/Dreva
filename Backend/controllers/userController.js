import AppError from "../utility/AppError.js";
import wrapAsync from "../utility/wrapAsync.js";
import User from "../models/userSchema.js";
import Product from "../models/productSchema.js";
import Review from "../models/reviewSchema.js";
import { userValidatorSchema } from "../utility/userValidator.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JWT_EXPIRATION, JWT_SECRET } from "../config/env.config.js";

//register new user
export const register = wrapAsync(async (req, res, next) => {
  const user = req.body;

  const { error } = userValidatorSchema.validate(user);
  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(",");
    throw new AppError(errorMessage, 400);
  }

  //check if user already exsist
  const exsistingUser = await User.findOne({ email: user.email });
  if (exsistingUser) {
    throw new AppError("User with this email already exists.", 400);
  }

  //hash password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  // Add image from cloudinary
  if (req.file) {
    user.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  //create user
  const newUser = await User.create(user);

  //generate jwt token
  const token = jwt.sign({ email: user.email, isUser: true }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });

  //store token in cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  //remove pass from response
  const userResponse = newUser.toObject();
  delete userResponse.password;
  console.log(userResponse);
  res.status(200).json({
    success: true,
    token,
    data: userResponse,
  });
});

//login user
export const loginUser = wrapAsync(async (req, res) => {
  const { email, password } = req.body;

  //find user
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  //verify password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new AppError("Invalid user credentials.", 401);
  }

  //generate jwt token
  const token = jwt.sign({ email: user.email, isUser: true }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });

  // Set token in cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  //remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(200).json({
    success: true,
    token,
    data: userResponse,
  });
});

//logout user
export const logoutUser = wrapAsync(async (req, res) => {
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

//get user profile
export const getUserProfile = wrapAsync(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password")
    .populate("cart")
    .populate("orderHistory")
    .populate("productReviews");

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// update user
export const updateUser = wrapAsync(async (req, res) => {
  const { name, email, addresses, wishlist, productReviews, password, role } =
    req.body;
  if (!req.user) {
    throw new AppError("User not Authenticated.", 404);
  }

  const { userId } = req.params;

  if (userId !== req.user._id.toString()) {
    throw new AppError("Not authorized to update this profile.", 403);
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  if (req.file) {
    user.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.addresses = addresses || user.addresses;
  user.wishlist = wishlist || user.wishlist;
  user.productReviews = productReviews || user.productReviews;
  user.role = role || user.role;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }
  await user.save();

  //populated and return
  const updatedUser = await User.findById(userId)
    .populate("wishlist productReviews")
    .select("-password");

  if (!updatedUser) {
    throw new AppError("User not found.", 404);
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});

//add product to cart
export const addToCart = wrapAsync(async (req, res) => {
  const { prodId } = req.params;

  let qty = parseInt(req.body.quantity, 10);
  if (isNaN(qty) || qty < 1) qty = 1;

  const userId = req.user?._id;

  //find product
  const product = await Product.findById(prodId);
  if (!product) {
    throw new AppError("Products not found.", 404);
  }

  // DB cart
  let dbCart = [];
  if (userId) {
    const user = await User.findById(userId).populate("cart.product");

    //check product already in DB cart
    const existingItem = user.cart.find(
      (item) => item.product && item.product.toString() === prodId.toString(),
    );

    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      user.cart.push({ product: prodId, quantity: qty });
    }

    await user.save();
    dbCart = await User.findById(userId)
      .populate("cart.product")
      .then((u) => u.cart);

    const total = dbCart.reduce(
      (sum, item) => sum + item.quantity * (item.product?.price || 0),
      0,
    );
    return res.status(200).json({
      success: true,
      data: {
        dbCart,
        total,
      },
      message: "Product added to  DB cart.",
    });
  }

  // For session cart
  if (!req.session.cart) {
    req.session.cart = [];
  }

  //check product already exsist
  const existingSessionItem = req.session.cart.find(
    (item) =>
      item.product && prodId && item.product.toString() === prodId.toString(),
  );

  if (existingSessionItem) {
    existingSessionItem.quantity += qty;
  } else {
    req.session.cart.push({
      product: prodId,
      quantity: qty,
    });
  }

  const total = req.session.cart.reduce(
    (sum, item) => sum + item.quantity * (product.price || 0),
    0,
  );

  res.status(200).json({
    success: true,
    data: {
      dbCart: req.session.cart,
      total,
    },
    message: "Product added to Sessioncart.",
  });
});

//get user cart
export const getCart = wrapAsync(async (req, res) => {
  const userId = req.user?._id;

  // Fetch from DB with product details
  if (userId) {
    const user = await User.findById(userId).populate("cart.product");

    const cart = user.cart || [];
    let total = 0;
    const dbCart = [];

    cart.forEach((item) => {
      if (item.product && item.product.price) {
        total += item.product.price * item.quantity;

        dbCart.push({
          _id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images?.[0]?.url || null,
        });
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        success: true,
        dbCart,
        total,
      },
    });
  }
  // Fetch from Session with product details
  const sessionCart = [];
  (req.session.cart || []).forEach((item) => {
    sessionCart.push({
      _id: item.product,
      quantity: item.quantity,
    });
  });

  return res.status(200).json({
    success: true,
    cart: sessionCart,
  });
});

// update cart item
export const updateCartItem = wrapAsync(async (req, res) => {
  const { prodId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    throw new AppError("Quantity must be at least 1.", 400);
  }

  const userId = req.user?._id;

  // DB cart
  let dbCart = [];
  let total = 0;
  if (userId) {
    const user = await User.findById(userId).populate("cart.product");
    if (!user) {
      throw new AppError("User not found.", 404);
    }

    let foundDb = false;
    user.cart.forEach((item) => {
      if (item.product && item.product._id.toString() === prodId.toString()) {
        item.quantity = quantity;
        foundDb = true;
      }
    });

    if (!foundDb) {
      throw new AppError("Product not found in DB cart.");
    }

    await user.save();

    user.cart.forEach((item) => {
      if (item.product && item.product.price) {
        total += item.product.price * item.quantity;

        dbCart.push({
          _id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images?.[0]?.url || null,
        });
      }
    });
  }

  // Session cart
  if (!req.session.cart) {
    req.session.cart = [];
  }

  let foundSession = false;
  req.session.cart.forEach((item) => {
    if (item.product.toString() === prodId.toString()) {
      item.quantity = quantity;
      foundSession = true;
    }
  });

  if (!userId && !foundSession) {
    throw new AppError("Product not found in session cart.");
  }

  res.status(200).json({
    success: true,
    message: "Cart item updated",
    total,
    dbCart,
    sessionCart: req.session.cart,
  });
});

//remove cart item
export const removeCartItem = wrapAsync(async (req, res) => {
  const { prodId } = req.params;
  const userId = req.user?._id;

  // Session cart update
  if (!req.session.cart) req.session.cart = [];

  req.session.cart = req.session.cart.filter(
    (item) => item.product && String(item.product) !== prodId.toString(),
  );

  // DB cart
  if (userId) {
    const user = await User.findById(userId).populate("cart.product");
    if (!user) {
      throw new AppError("User not found.", 404);
    }

    user.cart = user.cart.filter(
      (item) =>
        item.product && item.product._id.toString() !== prodId.toString(),
    );

    await user.save();
  }

  res.status(200).json({
    success: true,
    message: "Item removed from cart",
    sessionCart: req.session.cart,
    dbCart: userId ? await User.findById(userId).populate("cart.product") : [],
  });
});
