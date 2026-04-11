import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { verifyToken } from "../utils/jwt.verify.js";
import { ACCESS_KEY } from "../config/env.js";
import type { TokenPayload } from "../types/other.interface.js";
import type { AuthRequest } from "../types/other.interface.js";

export const authenticate = function (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  //   console.log("req: ", req.headers["authorization"]);
  const accessToken = req.headers["authorization"];
  if (!accessToken) {
    throw new ApiError(401, "Un-Authorized access");
  }
  const { validation: _id } = verifyToken(accessToken, ACCESS_KEY);
  req.userId = _id;
  next();
};
