import { useState, type FormEvent } from "react";
import { addItemToTodo } from "../../api/todos";
import { ApiError } from "../../api/client";
import type { Todo } from "../../types";
import {
  createEmptyAudioDraft,
  createEmptyTextDraft,
  type DraftTodoItem,
} from "../../utils/todoPayload";
import { DraftItemEditor } from "./DraftItemEditor";

interface AddTodoItemModalProps {
  todo: Todo;
  onClose: () => void;
  onAdded: () => Promise<void>;
}

export function AddTodoItemModal({
  todo,
  onClose,
  onAdded,
}: AddTodoItemModalProps) {
  const [draft, setDraft] = useState<DraftTodoItem>(createEmptyTextDraft());
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (draft.type === "text" && !draft.content.trim()) {
      setError("Enter task text.");
      return;
    }
    if (draft.type === "audio" && !draft.file) {
      setError("Record or upload an audio file.");
      return;
    }

    setSubmitting(true);

    try {
      await addItemToTodo(todo, draft);
      await onAdded();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to add task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-black">Add Task</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Add a task to{" "}
          <span className="font-medium text-black">{todo.todoName}</span>.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex rounded-md border border-zinc-200 p-1">
            <button
              type="button"
              onClick={() => setDraft(createEmptyTextDraft())}
              className={`flex-1 rounded py-2 text-xs font-medium transition ${
                draft.type === "text"
                  ? "bg-black text-white"
                  : "text-zinc-500 hover:text-black"
              }`}
            >
              Text
            </button>
            <button
              type="button"
              onClick={() => setDraft(createEmptyAudioDraft())}
              className={`flex-1 rounded py-2 text-xs font-medium transition ${
                draft.type === "audio"
                  ? "bg-black text-white"
                  : "text-zinc-500 hover:text-black"
              }`}
            >
              Audio
            </button>
          </div>

          <DraftItemEditor
            index={0}
            draft={draft}
            onChange={setDraft}
            showRemove={false}
            disabled={submitting}
          />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-zinc-200 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-md bg-black py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
