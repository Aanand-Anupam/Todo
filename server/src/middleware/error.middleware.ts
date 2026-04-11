import type { ErrorRequestHandler } from "express";
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message,
    success: false,
  });
};
