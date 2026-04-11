import mongoose, { Schema } from "mongoose";
import type { IUser, IUserModel } from "../types/model.interface.js";
import { ACCESS_KEY, REFRESH_KEY } from "../config/env.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema<IUser, IUserModel>(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    avatar: {
      avatar_public_id: {
        type: String,
      },
      avatar_url: {
        type: String,
      },
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);
//Bcrypt:
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
});

userSchema.methods.validatePassword = async function (plainPassword: string) {
  const isCorrect = await bcrypt.compare(plainPassword, this.password);
  return isCorrect;
};

//JWT:

userSchema.methods.generateAccessToken = function () {
  const accessToken = jwt.sign(
    {
      _id: this._id,
    },
    ACCESS_KEY,
    {
      expiresIn: "15m",
    },
  );
  return accessToken;
};

userSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign(
    {
      _id: this._id,
    },
    REFRESH_KEY,
    {
      expiresIn: "7d",
    },
  );
  return refreshToken;
};

userSchema.statics.findExistingUser = function (
  userName: string,
  email: string,
) {
  return this.findOne({ $or: [{ userName }, { email }] });
};

export const User = mongoose.model<IUser, IUserModel>("User", userSchema);
