import type { Response } from "express";
import { Todo } from "../models/todo.model.js";
import type { AuthRequest } from "../types/other.interface.js";
import { ApiError } from "../utils/ApiError.js";
import { successRes } from "../utils/response.js";
import { aiService } from "../services/ai.service.js";

export const aiController = {
  getInsights: async function (req: AuthRequest, res: Response) {
    const userId = req.userId;
    if (!userId) {
      throw new ApiError(500, "No userId found in getInsights");
    }

    const periodDays = Math.min(
      Math.max(Number(req.query.days) || 7, 3),
      30,
    );

    const todos = await Todo.find({ creator: userId });
    const insights = await aiService.buildInsights(todos, periodDays);

    return successRes(res, "AI insights generated", 200, insights);
  },
};
