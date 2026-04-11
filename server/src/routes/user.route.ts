import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { authenticate } from "../middleware/authenticate.js";
import { authController } from "../controllers/auth.controller.js";

export const userRoute = Router();

userRoute.post(
  "/register",
  upload.single("avatar"),
  userController.registerUser,
);
userRoute.post("/login", upload.none(), userController.loginUser);
userRoute.post("/logout", authenticate, userController.logoutUser);
userRoute.post(
  "/update",
  authenticate,
  upload.none(),
  userController.updateUser,
);
userRoute.post(
  "/updateAvatar",
  authenticate,
  upload.single("avatar"),
  userController.updateAvatar,
);
userRoute.get("/refresh", authController.refresh_Access_Token);
