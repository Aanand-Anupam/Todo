import { Router } from "express";
import { todoController } from "../controllers/todo.controller.js";
import { upload } from "../middleware/multer.middleware.js";

export const todoRouter = Router();

todoRouter.get("/getTodo", todoController.getTodo);
todoRouter.post("/createTodo", upload.any(), todoController.createTodo);
todoRouter.post(
  "/updateTodo/:todoName",
  upload.any(),
  todoController.updateTodo,
);
todoRouter.post("/deleteTodo", todoController.deleteTodo);
