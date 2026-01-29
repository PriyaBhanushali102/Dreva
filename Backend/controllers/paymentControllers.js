import {
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
} from "../config/env.config.js";
import AppError from "../utility/AppError.js";
import wrapAsync from "../utility/wrapAsync.js";
import Stripe from "stripe";
import Order from "../models/orderSchema.js";
import User from "../models/userSchema.js";
import mongoose from "mongoose";
const stripe = new Stripe(STRIPE_SECRET_KEY);
import dotenv from "dotenv";
dotenv.config();

export const createCheckoutSession = wrapAsync(async (req, res) => {
  const { name, address, city, state, zipcode, paymentMethod } = req.body;
  const user = await User.findById(req.user._id).populate("cart.product");

  if (!user.cart.length) {
    throw new AppError("Cart is empty", 400);
  }

  // 2. Prepare Line Items
  const line_items = user.cart.map((item) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: "Dreva Products",
      },
      unit_amount: Math.round(item.product.price * 100),
    },
    quantity: item.quantity,
  }));

  // Determine Stripe payment types
  let allowed_methods = ["card"];
  if (paymentMethod === "UPI") {
    allowed_methods.push("upi");
  }
  const uniqueSessionPlaceholder = `pending_${user._id}_${Date.now()}`;

  // 3. Create Pending Order in DB
  const order = await Order.create({
    customer: user._id,
    address: { street: address, city, state, zipcode, country: "India" },
    items: user.cart.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
      vendor: item.product.vendor,
    })),
    total:
      user.cart.reduce(
        (acc, item) => acc + item.quantity * item.product.price,
        0,
      ) * 1.18,
    subtotal: user.cart.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0,
    ),
    tax: 0.18,
    status: "Processing",
    paymentMethod: paymentMethod,
    paymentStatus: "Pending",
    stripeSessionId: "pending",
  });

  // Checkout session
  let session;
  session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: user.email,
    metadata: {
      userId: user._id.toString(),
      orderId: order._id.toString(),
    },
    line_items,
    success_url: `${process.env.CORS_ORIGIN}/order-confirmation/${order._id}`,
    cancel_url: `${process.env.CORS_ORIGIN}/cart`,
  });

  await Order.findByIdAndUpdate(order._id, {
    stripeSessionId: session.id,
  });

  res.status(200).json({ url: session.url });
});

export const handleWebhook = wrapAsync(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    throw new AppError("Webhook Error", 400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { userId, orderId } = session.metadata;

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "Paid",
        paymentMethod: "Card",
        status: "Processing",
      });
      await User.findByIdAndUpdate(userId, { $set: { cart: [] } });
    }
  }
  res.json({ received: true });
});
