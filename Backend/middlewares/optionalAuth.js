import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import { JWT_SECRET } from "../config/env.config.js";

export const optionalAuth = async (req, res, next) => {
  let token;

  // Check Headers or Cookies
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  // If no token, simply continue request as "Guest" (req.user will be undefined)
  if (!token) {
    return next();
  }

  try {
    // If token exists, try to identify the user
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findOne({ email: decoded.email }).select("-password");
  } catch (error) {
    // If token is invalid/expired, ignore it and treat as Guest
    console.log("Optional Auth: Token invalid, proceeding as guest.");
  }

  next();
};
