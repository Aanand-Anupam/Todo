import { Router } from "express";
import { userRoute } from "./user.route.js";
import { todoRouter } from "./todo.route.js";
import { authenticate } from "../middleware/authenticate.js";

export const apiRoute = Router();

apiRoute.use("/user", userRoute);
apiRoute.use("/todo", todoRouter);
