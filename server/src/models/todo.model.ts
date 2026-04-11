import mongoose, { mongo, Schema } from "mongoose";
import type { ITodo } from "../types/model.interface.js";

const todoSchema = new Schema<ITodo>(
  {
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
          type: {
            type: String,
            enum: ["DONE", "MISSED", "UPCOMING"],
            default: "UPCOMING",
          },
        },
        order: {
          type: Number,
          required: true,
        },
      },
    ],

    creator: {
      type: Schema.Types.ObjectId,
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
