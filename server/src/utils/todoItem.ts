import type { ITodoItem_DB } from "../types/model.interface.js";

export function applyItemStatusMetadata(
  item: ITodoItem_DB,
  status: ITodoItem_DB["status"],
) {
  item.status = status;
  if (status === "DONE") {
    item.completedAt = new Date();
  } else {
    delete item.completedAt;
  }
}

export function completionTimestampForItem(
  item: ITodoItem_DB,
  todoUpdatedAt: Date,
): Date | null {
  if (item.status !== "DONE") return null;
  if (item.completedAt) return new Date(item.completedAt);
  return todoUpdatedAt;
}
