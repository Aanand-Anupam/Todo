import { Router } from "express";
import { todoController } from "../controllers/todo.controller.js";
import { upload } from "../middleware/multer.middleware.js";

export const todoRouter = Router();

todoRouter.get("/getTodos", todoController.getTodos);
todoRouter.get("/getTodo/:todoId", todoController.getTodo);
todoRouter.post("/createTodo", upload.any(), todoController.createTodo);
todoRouter.post("/updateTodo/:todoId", upload.any(), todoController.updateTodo);
todoRouter.post("/deleteTodo/:todoId", todoController.deleteTodo);
