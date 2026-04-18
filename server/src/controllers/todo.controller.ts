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
    const _id = req.userId;
    if (!_id) {
      throw new ApiError(500, "No userId found in createTodo");
    }
    const todoName = req.body.todoName;

    const existed_Todo = await Todo.findOne({ todoName, creator: _id });
    if (existed_Todo) {
      throw new ApiError(400, "Same todoName exist");
    }

    const uploaded = req.files as Express.Multer.File[];

    const item_order: ITodo_Input[] = JSON.parse(req.body.order);

    let items: ITodo_Basic_DB[] = await todoServices.CreateService(
      item_order,
      uploaded,
    );
    // console.log("items: ", items);
    const todo_document = await Todo.create({
      todoName,
      items,
      creator: _id,
    });
    // Problem : Status is not getting saved in document...
    if (!todo_document) {
      throw new ApiError(500, "Not able create Todo");
    }

    successRes(res, "Data saved..", 200, { todo_document });
  },

  updateTodo: async function (req: AuthRequest, res: Response) {
    // console.log("Inside updateTodo");
    const _id = req.userId;
    if (!_id) {
      throw new ApiError(500, "No userId found inside updateTodo");
    }
    const todoId = req.params.todoId as string;
    if (!todoId) {
      throw new ApiError(400, "provide valid route");
    }

    const old_todo_obj = await Todo.findOne({ _id: todoId });

    if (!old_todo_obj) {
      throw new ApiError(400, "Provide valid route");
    }
    if (_id.toString() !== old_todo_obj.creator.toString()) {
      throw new ApiError(402, "You are not allowed to perform this action");
    }
    // console.log("Owner is requesting for change. ");

    let old_todo_list: ITodoItem_DB[] = old_todo_obj.items;

    const uploaded_files = req.files as Express.Multer.File[];

    const updated_item: ITodoItem_DB[] = JSON.parse(
      req.body.update_item || "[]",
    );
    const new_item: ITodo_Input[] = JSON.parse(req.body.new_item || "[]");
    const deleted_item: string[] = JSON.parse(req.body.deleted_item || "[]");
    // console.log("Calling update Service method ");

    const new_todo_list: ITodoItem_DB[] = await todoServices.updateServices(
      old_todo_list,
      updated_item,
      new_item,
      deleted_item,
      uploaded_files,
    );
    old_todo_obj.items = new_todo_list;
    // console.log("Update service has done its work.");

    const updated_old_todo = await old_todo_obj.save({
      validateModifiedOnly: true,
    });

    return successRes(res, "Done Dana Done...", 200, updated_old_todo);
  },
  deleteTodo: async function (req: AuthRequest, res: Response) {
    const _id = req.userId;
    if (!_id) {
      throw new ApiError(500, "No userId found inside deleteTodo");
    }
    const todoId = req.params.todoId;
    if (!todoId) {
      throw new ApiError(400, "select valid todo");
    }
    const todo = await Todo.findOne({ _id: todoId, creator: _id });
    if (!todo) {
      throw new ApiError(400, "No such todo was found!");
    }
    if (todo.creator.toString() !== _id.toString()) {
      throw new ApiError(401, "User and creator are different");
    }
    todo.deleteStatus = "PENDING";
    todo.deletedAt = new Date();
    await todo.save({ validateModifiedOnly: true });

    successRes(res, "Todo deleted request placed.", 200);
  },
  getTodos: async function (req: AuthRequest, res: Response) {
    const _id = req.userId;
    if (!_id) {
      throw new ApiError(500, "id not found inside getTodos");
    }
    const todos = await Todo.find({ creator: _id });

    return successRes(res, "Here are all todos", 200, todos);
  },
  getTodo: async function (req: AuthRequest, res: Response) {
    const _id = req.userId;
    if (!_id) {
      throw new ApiError(500, "No id was found in getTodo");
    }
    const todoId = req.params.todoId;
    if (!todoId) {
      throw new ApiError(400, "Provide valid todoId");
    }
    const todo = await Todo.findById({ todoId });
    if (!todo) {
      throw new ApiError(400, "No todo was found in db");
    }
    return successRes(res, "Here is the todo", 200, todo);
  },
};
