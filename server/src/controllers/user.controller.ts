import { User } from "../models/user.model.js";
import {
  type Request,
  type Response,
  type CookieOptions,
  type NextFunction,
} from "express";
import { successRes } from "../utils/response.js";
import fs from "fs";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import type { Avatar, IUser, IUserModel } from "../types/model.interface.js";
import type mongoose from "mongoose";
import type { HydratedDocument } from "mongoose";

import { ApiError } from "../utils/ApiError.js";
import type { AuthRequest } from "../types/other.interface.js";

const options: CookieOptions = {
  httpOnly: true,
  secure: true,
  expires: new Date(Date.now() + 72 * 36000),
};

const generate_AccessToken_RefreshToken = async function (
  user: HydratedDocument<IUser>, // HydratedDocument<IUser> -> IUser inference + Mongoose functions
) {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateModifiedOnly: true });

  return { accessToken, refreshToken };
};

export const userController = {
  registerUser: async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    // console.log("All well here registerUser");
    try {
      const { userName, email, password } = req.body;

      if (
        [userName, email, password].some(
          (key) => typeof key !== "string" || key.trim() === "",
        )
      ) {
        throw new ApiError(
          400,
          "All fields are mandatory and expected as strings !",
        );
      }

      const existingUser = await User.findExistingUser(userName, email);
      if (existingUser) {
        // return errorRes(res, "User already Exist with given credentials!", 400);
        console.log("User already Exist with given credentials!");
        throw new ApiError(400, "User already Exist with given credentials!");
      }
      console.log("Still Running");
      const avatar_localFile = req.file;
      let avatar_url =
        "https://res.cloudinary.com/aanand-anupam/image/upload/v1767101069/aobiqgth8xcgxzcpmv0p.jpg";
      let avatar_public_id = "";
      if (avatar_localFile) {
        const uploaded_res = await uploadOnCloudinary(avatar_localFile.path);
        avatar_url = uploaded_res?.secure_url;
        avatar_public_id = uploaded_res?.public_id;
      }

      const user = await User.create({
        userName,
        email,
        password,
        avatar: {
          avatar_public_id,
          avatar_url,
        },
      });

      const { accessToken, refreshToken } =
        await generate_AccessToken_RefreshToken(user);

      const createdUser = await User.findById(user._id).select(
        "-password -refreshToken",
      );
      if (!createdUser) {
        throw new ApiError(
          500,
          "Something went wrong while registering user on server side",
        );
      }

      res.cookie("refreshToken", refreshToken, options);
      successRes(res, "User Registered successfully", 201, {
        createdUser,
        accessToken: accessToken,
      });
    } catch (error) {
      const avatar_localFile = req.file;
      if (avatar_localFile) {
        fs.unlinkSync(avatar_localFile.path);
      }
      next(error);
    }
  },
  loginUser: async function (req: Request, res: Response) {
    const { userName, password, email } = req.body;
    if (
      [userName, password].some(
        (key) => typeof key !== "string" || key.trim() === "",
      ) &&
      [email, password].some(
        (key) => typeof key !== "string" || key.trim() === "",
      )
    ) {
      throw new ApiError(400, "Provide proper detail..");
    }
    const user = await User.findOne({ $or: [{ userName }, { email }] });
    if (!user) {
      throw new ApiError(400, "No User found with given credentials");
    }
    const isPasswordCorrect = await user.validatePassword(password);
    if (!isPasswordCorrect) {
      throw new ApiError(401, "Password is wrong ");
    }
    const { accessToken, refreshToken } =
      await generate_AccessToken_RefreshToken(user);

    user.password = "";
    user.refreshToken = "";
    res.cookie("refreshToken", refreshToken, options);
    console.log("accessToken: ", accessToken);
    return successRes(res, "Login Successfull ", 200, {
      user,
      accessToken: accessToken,
    }); // To be considered in future -> if we even need user.
  },
  logoutUser: async function (req: AuthRequest, res: Response) {
    // User is already logged In -> will check in the middleware.
    const _id = req.userId;
    if (!_id) {
      throw new ApiError(500, "No id arrivied inside logOut function.");
    }
    const user = await User.findById(_id);
    if (!user) {
      throw new ApiError(500, "Unable to find the user in db");
    }
    res.clearCookie("refreshToken", options);
    user.refreshToken = "";
    await user.save({ validateModifiedOnly: true });

    successRes(res, "LogOut successfully!", 200);
  },
  updateUser: async function (req: AuthRequest, res: Response) {
    const _id = req.userId;
    if (!_id) {
      throw new ApiError(500, "No userId was found in updateUser ");
    }
    const user = await User.findById(_id);
    if (!user) {
      throw new ApiError(500, "No User found in db corresponding to userId ");
    }
    const allowed_fields = ["userName", "email", "password"];
    const { userName, email, password } = req.body;
    // console.log("Hello ");
    const update_obj = {
      userName: userName,
      email: email,
      password: password,
    };
    const filterUpdates = Object.fromEntries(
      Object.entries(update_obj).filter(
        ([key, value]) =>
          allowed_fields.includes(key) &&
          typeof value === "string" &&
          value.trim() !== "",
      ),
    );
    Object.assign(user, filterUpdates);
    user.save({ validateModifiedOnly: true });
    successRes(res, "User updated successfully", 200, { user });
  },
  updateAvatar: async function (req: AuthRequest, res: Response) {
    const _id = req.userId;
    if (!_id) {
      throw new ApiError(500, "No userId found in updateAvatar ");
    }
    const avatar_localFile = req.file;
    if (!avatar_localFile) {
      throw new ApiError(500, "No avatar file found ");
    }
    let uploaded_res, avatar_url: string, avatar_public_id: string;

    uploaded_res = await uploadOnCloudinary(avatar_localFile.path);
    avatar_url = uploaded_res?.secure_url;
    avatar_public_id = uploaded_res?.public_id;
    console.log("All good till here...");
    if (!uploaded_res) {
      throw new ApiError(500, "Error while uploading avatar");
    }

    const user = await User.findById(_id);
    if (!user) {
      throw new ApiError(500, "No User found with id");
    }
    const old_avatar_id = user.avatar?.avatar_public_id;

    const avatar: Avatar = {
      avatar_url,
      avatar_public_id,
    };
    user.avatar = avatar;
    user.save({ validateModifiedOnly: true });

    if (old_avatar_id) {
      await deleteFromCloudinary(old_avatar_id);
    }

    successRes(res, "Avatar updated !!", 200);
  },
};
