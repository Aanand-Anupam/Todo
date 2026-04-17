import mongoose, { Schema } from "mongoose";
import type { ITodo } from "../types/model.interface.js";

const todoSchema = new Schema<ITodo>(
  {
    // Here ITodo just represent how data will look like post document creation...
    todoName: {
      type: String,
      required: true,
      unique: true,
      default: new Date().toDateString(),
    },
    items: [
      {
        type: {
          type: String,
          enum: ["text", "audio"],
          default: "text",
          required: true,
        },
        content: { type: String },
        url: { type: String },
        public_id: { type: String },
        status: {
          type: String,
          enum: ["DONE", "MISSED", "UPCOMING"],
          default: "UPCOMING",
          required: true,
        },
        order: {
          type: Number,
          required: true,
        },
        fieldName: {
          type: String,
        },
      },
    ],

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

todoSchema.pre("save", function () {
  this.items = this.items.sort((a, b) => a.order - b.order);
});

export const Todo = mongoose.model("Todo", todoSchema);
