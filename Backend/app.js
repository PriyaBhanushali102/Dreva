import dotenv from "dotenv";

// if (process.env.NODE_ENV === "production") {
//   dotenv.config({
//     path: "config/.env",
//   });
// }

import express from "express";
import { connectDB } from "./config/db.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { handle404, globalErrorHandler } from "./middlewares/ErrorHandler.js";
import cors from "cors";
import rateLimit from "express-rate-limit";

dotenv.config();
const app = express();

connectDB();

app.set("trust proxy", 1);

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, //1day
      httpOnly: true,
    },
  }),
);
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, //limit each IP to 100 requests
  message: "Too many requests, please try again later.",
});

if (process.env.NODE_ENV === "production") {
  app.use("/api/", limiter);
}

// Express Routes
app.use("/api/users", userRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);

// Undefined routes handler
app.use(handle404);

// Global error handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
