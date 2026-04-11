import { Document, Types, Model } from "mongoose";
export interface Avatar {
  avatar_url: string;
  avatar_public_id: string;
}
export interface IUser extends Document {
  userName: string;
  password: string;
  email?: string;
  avatar?: Avatar;
  createdAt: Date;
  updatedAt: Date;
  refreshToken: string;
  validatePassword(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export interface IUserModel extends Model<IUser> {
  findExistingUser(userName: string, email: string): Promise<IUser | null>;
}

type Status = "DONE" | "MISSED" | "UPCOMING";

export interface ITodoItem {
  type: "text" | "audio";
  content?: string;
  url?: string;
  public_id?: string;
  status: "DONE" | "MISSED" | "UPCOMING";
  order: number;
}

export interface ITodo extends Document {
  items: ITodoItem[];
  creator: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
