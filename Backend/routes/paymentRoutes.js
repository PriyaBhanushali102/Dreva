import express from "express";
const router = express.Router();
import { userProtect } from "../middlewares/userProtect.js";
import {
  createCheckoutSession,
  handleWebhook,
} from "../controllers/paymentControllers.js";

router.post("/create-checkout-session", userProtect, createCheckoutSession);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook,
);

export default router;
