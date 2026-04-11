import type { Response } from "express";
export const successRes = <T>(
  res: Response,
  message: string,
  status: number = 200,
  data?: T,
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};
