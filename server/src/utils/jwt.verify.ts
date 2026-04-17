import jwt from "jsonwebtoken";
import { ApiError } from "./ApiError.js";
import type { TokenPayload } from "../types/other.interface.js";

export const verifyToken = function (token: string, secretKey: string) {
  try {
    const validation = jwt.verify(token, secretKey) as TokenPayload;

    return { validation };
  } catch (error) {
    throw new ApiError(401, "jwt not verified");
  }
};
