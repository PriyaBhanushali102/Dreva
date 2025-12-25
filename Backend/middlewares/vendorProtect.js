import wrapAsync from "../utility/wrapAsync.js";
import AppError from "../utility/AppError.js";
import jwt, { decode } from "jsonwebtoken";
import Vendor from "../models/vendorSchema.js";
import { JWT_SECRET } from "../config/env.config.js";

export const vendorProtect = wrapAsync(async (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new AppError("Not Authorized, no token", 401);
  }

  console.log("Authorization Header:", req.headers.authorization);

  console.log("HEADERS: ", req.headers);

  const decoded = jwt.verify(token, JWT_SECRET);
  console.log("📦 Decoded:", decoded);
  const vendor = await Vendor.findOne({ email: decoded.email }).select(
    "-password"
  );

  if (!vendor) {
    throw new AppError("Vendor not found", 401);
  }
  req.vendor = vendor;
  console.log(token);
  console.log("✅ Authenticated vendor:", req.vendor);

  return next();
});
