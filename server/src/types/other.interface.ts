import type { JwtPayload } from "jsonwebtoken";
import type { Request } from "express";

export interface TokenPayload extends JwtPayload {
  _id: string;
}
export interface AuthRequest extends Request {
  userId?: TokenPayload;
}
