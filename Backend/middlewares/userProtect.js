import jwt, { decode } from "jsonwebtoken";
import User from "../models/userSchema.js";
import { JWT_SECRET } from "../config/env.config.js";
import cookieParser from "cookie-parser";

export const userProtect = async (req, res, next) => {
  let token;

  // Authorization header check
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // If not in header, check cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Token missing
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  // Verify and attach user
  try {
    console.log("HEADERS: ", req.headers);

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ email: decoded.email }).select(
      "-password"
    );

    console.log("Decoded token:", decoded);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    console.log("req.user set to:", req.user);

    next();
  } catch (error) {
    console.error("JWT ERROR:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
