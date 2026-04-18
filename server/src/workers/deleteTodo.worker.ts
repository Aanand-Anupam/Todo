import { Todo } from "../models/todo.model.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";
export const deleteTodo_worker = async function () {
  const del_todo = await Todo.find({
    deleteStatus: { $in: ["PENDING", "FAILED"] },
  });
  for (const todo of del_todo) {
    try {
      for (const item of todo.items) {
        if (item.type === "audio") {
          const public_id = item.public_id;
          if (!public_id) continue;
          await deleteFromCloudinary(public_id);
        }
      }
      await Todo.deleteOne(todo);
    } catch (error) {
      todo.deleteStatus = "FAILED";
      todo.save({ validateModifiedOnly: true });
    }
  }
};
