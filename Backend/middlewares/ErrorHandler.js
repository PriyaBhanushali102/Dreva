import { config } from "dotenv";
import AppError from "../utility/AppError.js";

const handleDBCastError = (err) => {
  const message = `Invalid ${err.path}> ${err.value}`;
  return new AppError(message, 400);
};

const handleDBDuplicateFields = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleDBValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError("Invalid token. Please log in again!", 401);
};

const handleJWTExpiredError = () => {
  return new AppError("Your token has expired! Please log in again.", 401);
};

const sendErrorDev = (err, req, res) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  // API requests, send json response
  if (req.originalUrl.startsWith("/api")) {
    return res.status(statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  if (err.isOperational) {
    return res.status(statusCode).json({
      status,
      message: err.message,
    });
  }

  console.log("ERROR:", err);
  return res.status(500).json({
    status: "error",
    message: "Something went very wrong!",
  });
};

// GLOBAL ERROR HANDLER
export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (err.name === "CastError") error = handleDBCastError(error);
    if (err.code === 11000) error = handleDBDuplicateFields(error);
    if (err.name === "ValidationError") error = handleDBValidationError(error);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};

export const handle404 = (req, res, next) => {
  const err = new AppError(`cannot find ${req.originalUrl}`, 404);
  next(err);
};
