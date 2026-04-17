import type { ErrorRequestHandler } from "express";
import fs from "fs";
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (req.file?.path) {
    fs.unlinkSync(req.file.path);
  }
  if (req.files && Array.isArray(req.files)) {
    const local_files: Express.Multer.File[] = req.files;
    local_files.forEach((file: Express.Multer.File) =>
      fs.unlinkSync(file.path),
    );
  }

  res.status(err.statusCode || 500).json({
    message: err.message,
    success: false,
  });
};
