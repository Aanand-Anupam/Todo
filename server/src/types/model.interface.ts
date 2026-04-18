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

export interface ITodo_Basic_DB {
  // How Todo will stored inside document...
  type: "text" | "audio";
  content?: string;
  url?: string;
  public_id?: string;
  status: "DONE" | "MISSED" | "UPCOMING";
  order: number;
  fieldName?: string;
}

export interface ITodoItem_DB extends ITodo_Basic_DB {
  // When retrived from db we will get data in this format....
  _id?: Types.ObjectId;
}

export interface ITodo_Input {
  // user - input will come in this format....
  type: "text" | "audio";
  content?: string;
  status: "DONE" | "MISSED" | "UPCOMING";
  order: number;
  fieldName?: string; // THis will be used to match audio files ...
}

export interface ITodo extends Document {
  todoName: string;
  items: ITodoItem_DB[];
  creator: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  deleteStatus: "PENDING" | "ACTIVE" | "FAILED";
  deletedAt: Date;
}
