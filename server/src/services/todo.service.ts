import type {
  ITodo_Basic_DB,
  ITodo_Input,
  ITodoItem_DB,
} from "../types/model.interface.js";
import { ApiError } from "../utils/ApiError.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import type {} from "../types/other.interface.js";

export const todoServices = {
  CreateService: async function (
    item_order: ITodo_Input[],
    uploaded: Express.Multer.File[],
  ): Promise<ITodo_Basic_DB[]> {
    // let index = 1;
    let items: ITodo_Basic_DB[] = [];
    for (const item of item_order) {
      let todo_item: ITodo_Basic_DB;
      if (item.type === "text") {
        todo_item = {
          type: "text",
          content: item.content as string,
          status: "UPCOMING",
          order: item.order,
        };
        items.push(todo_item);
      } else if (item.type === "audio") {
        const local_file_path = uploaded.find(
          (file) => file.fieldname === item.fieldName,
        )?.path;
        if (!local_file_path) continue;
        console.log("Local path: ", local_file_path);
        const uploades_res = await uploadOnCloudinary(local_file_path);
        if (!uploades_res)
          throw new ApiError(
            500,
            "Something went wrong while uploading files on cloudinary. ",
          );
        todo_item = {
          type: "audio",
          url: uploades_res.secure_url,
          public_id: uploades_res.public_id,
          status: "UPCOMING",
          order: item.order,
        };
        items.push(todo_item);
      }
    }
    return items;
  },
  updateServices: async function (
    old_todo_list: ITodoItem_DB[],
    update_item: ITodoItem_DB[],
    new_item: ITodo_Input[],
    deleted_item: string[],
    uploaded_files: Express.Multer.File[],
  ) {
    // Remove deleted-data:

    old_todo_list.filter(
      (old) => old._id && !deleted_item.includes(old._id.toString()),
    );

    // update_item:
    // let new_todo_list: ITodo_Basic_DB[] = [];
    for (let item of update_item) {
      let old_item = old_todo_list.find((file) => file._id === item._id);

      if (!old_item) continue;

      if (item.type === "text" && old_item) {
        old_item.content = item.content as string;
        old_item.status = item.status;
        old_item.order = item.order;
      } else if (item.type === "audio") {
        const old_file_id = old_item.public_id;
        const new_file_path = uploaded_files.find(
          (file) => file.fieldname === item.fieldName,
        )?.path;
        if (!old_file_id || !new_file_path) continue;
        const new_file_uploaded = await this.replaceFileService(
          new_file_path,
          old_file_id,
        ); // This fn will remove old_file from cloudinary , upload new_file on cloudinary and return url of uploaded file.
        old_item.order = item.order;
        old_item.status = item.status;
        old_item.public_id = new_file_uploaded.public_id;
        old_item.url = new_file_uploaded.secure_url;
      }
    }

    // new item_add:
    let temp_item: ITodoItem_DB;
    for (let item of new_item) {
      if (item.type === "text") {
        temp_item = {
          type: "text",
          content: item.content as string,
          status: "UPCOMING",
          order: item.order,
        };
        old_todo_list.push(temp_item);
      } else if (item.type === "audio") {
        const file_local_file = uploaded_files.find(
          (file) => file.fieldname === item.fieldName,
        )?.path;
        if (!file_local_file) continue;
        const uploaded_res = await uploadOnCloudinary(file_local_file);
        if (!uploaded_res) {
          throw new ApiError(
            500,
            "something went wrong while uploading file on db.",
          );
        }
        temp_item = {
          type: "audio",
          url: uploaded_res.secure_url,
          status: item.status,
          order: item.order,
          public_id: uploaded_res.public_id,
          fieldName: item.fieldName as string,
        };
        old_todo_list.push(temp_item);
      }
    }

    return old_todo_list;
  },
  replaceFileService: async function (
    new_file_path: string,
    old_file_id: string,
  ) {
    if (!new_file_path || !old_file_id) {
      throw new ApiError(500, "complete info. has not arrived");
    }
    const new_upload_res = await uploadOnCloudinary(new_file_path);
    if (!new_upload_res) {
      throw new ApiError(
        500,
        "Not able to upload file on cloud inside replaceFileService",
      );
    }
    await deleteFromCloudinary(old_file_id);
    return new_upload_res;
  },
};
