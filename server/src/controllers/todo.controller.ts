import type { Response, Request } from "express";
import { Todo } from "../models/todo.model.js";
import type { AuthRequest } from "../types/other.interface.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import type {
  ITodo,
  ITodo_Basic_DB,
  ITodo_Input,
  ITodoItem_DB,
} from "../types/model.interface.js";
import { successRes } from "../utils/response.js";
import type { Types } from "mongoose";
import { todoServices } from "../services/todo.service.js";

export const todoController = {
  createTodo: async function (req: AuthRequest, res: Response) {
    // console.log("All well here createTodo");
    const _id = req.userId;
    if (!_id) {
      throw new ApiError(500, "No userId found in createTodo");
    }
    const todoName = req.body.todoName;
    const uploaded = req.files as Express.Multer.File[];

    const item_order: ITodo_Input[] = JSON.parse(req.body.order);

    let items: ITodo_Basic_DB[] = await todoServices.CreateService(
      item_order,
      uploaded,
    );

    const todo_document = await Todo.create({
      todoName,
      items,
      creator: _id,
    });
    if (!todo_document) {
      throw new ApiError(500, "Not able create Todo");
    }

    successRes(res, "Data saved..", 200, { todo_document });
  },
  updateTodo: async function (req: AuthRequest, res: Response) {
    console.log("Inside updateTodo");
    const _id = req.userId;
    if (!_id) {
      throw new ApiError(500, "No userId found inside updateTodo");
    }
    const todoName = req.params.todoName;
    if (!todoName) {
      throw new ApiError(400, "provide valid route");
    }
    const old_todo_obj = await Todo.findOne({ todoName });

    if (!old_todo_obj) {
      throw new ApiError(400, "Provide valid route");
    }
    if (_id.toString() !== old_todo_obj.creator.toString()) {
      throw new ApiError(402, "You are not allowed to perform this action");
    }

    let old_todo_list: ITodoItem_DB[] = old_todo_obj.items;

    const uploaded_files = req.files as Express.Multer.File[];

    const updated_item: ITodoItem_DB[] = JSON.parse(req.body.update_item);
    const new_item: ITodo_Input[] = JSON.parse(req.body.new_item);
    const deleted_item: string[] = JSON.parse(req.body.deleted_item);

    const new_todo_list: ITodoItem_DB[] = await todoServices.updateServices(
      old_todo_list,
      updated_item,
      new_item,
      deleted_item,
      uploaded_files,
    );
    old_todo_obj.items = new_todo_list;
  },
  deleteTodo: async function () {},
  getTodo: async function () {},
};
