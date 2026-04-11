import { Router } from "express";
import { todoController } from "../controllers/todo.controller.js";

export const todoRouter = Router();

todoRouter.post("/createTodo", todoController.createTodo);
todoRouter.put("/updateTodo", todoController.updateTodo);
todoRouter.post("/deleteTodo", todoController.deleteTodo);
