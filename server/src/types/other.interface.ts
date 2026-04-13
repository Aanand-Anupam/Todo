import type { JwtPayload } from "jsonwebtoken";
import type { Request } from "express";
import type { Types } from "mongoose";

export interface TokenPayload {
  _id: string;
}
export interface AuthRequest extends Request {
  userId?: string;
}
