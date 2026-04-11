import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { verifyToken } from "../utils/jwt.verify.js";
import { REFRESH_KEY } from "../config/env.js";
import { User } from "../models/user.model.js";
import { successRes } from "../utils/response.js";

export const authController = {
  refresh_Access_Token: async function (req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new ApiError(401, "Login Pls. ");
    }
    const { validation: _id } = verifyToken(refreshToken, REFRESH_KEY);
    const user = await User.findById(_id);
    if (!user) {
      throw new ApiError(500, "No user exist with given Refresh_token ");
    }
    const accessToken = user?.generateAccessToken();
    return successRes(res, "accessToken created", 201, { accessToken });
  },
};
