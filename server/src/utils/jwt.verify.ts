import jwt from "jsonwebtoken";
import { ApiError } from "./ApiError.js";
import type { TokenPayload } from "../types/other.interface.js";
export const verifyToken = function (token: string, secretKey: string) {
  const validation = jwt.verify(token, secretKey) as TokenPayload;
  if (!validation) {
    throw new ApiError(401, "Invalid Access Token");
  }
  return { validation };
};
