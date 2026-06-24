import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createTodoDocument } from "../../api/todos";
import { ApiError } from "../../api/client";
import { useTodos } from "../../context/TodosContext";
import {
  createEmptyAudioDraft,
  createEmptyTextDraft,
  validateDrafts,
  type DraftTodoItem,
} from "../../utils/todoPayload";
import { DraftItemEditor } from "./DraftItemEditor";

interface CreateTodoDocumentModalProps {
  onClose: () => void;
}

export function CreateTodoDocumentModal({
  onClose,
}: CreateTodoDocumentModalProps) {
  const navigate = useNavigate();
  const { refreshTodos } = useTodos();
  const [todoName, setTodoName] = useState("");
  const [drafts, setDrafts] = useState<DraftTodoItem[]>([
    createEmptyTextDraft(),
  ]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateDraft = (id: string, next: DraftTodoItem) => {
    setDrafts((current) => current.map((d) => (d.id === id ? next : d)));
  };

  const removeDraft = (id: string) => {
    setDrafts((current) =>
      current.length === 1 ? current : current.filter((d) => d.id !== id),
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateDrafts(drafts);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      const created = await createTodoDocument(todoName, drafts);
      await refreshTodos();
      onClose();
      if (created?._id) {
        navigate(`/dashboard/lists/${created._id}`);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create list");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-zinc-200 bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-black">New Todo List</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Create a document with text and audio tasks, like your Postman
          request.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div>
            <label className="mb-2 block text-xs text-zinc-500">todoName</label>
            <input
              autoFocus
              required
              value={todoName}
              onChange={(e) => setTodoName(e.target.value)}
              className="w-full rounded-md border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-black"
              placeholder="Friday_Plan_G"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs text-zinc-500">order (tasks)</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setDrafts((current) => [...current, createEmptyTextDraft()])
                  }
                  className="text-xs text-zinc-500 hover:text-black"
                >
                  + Text
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setDrafts((current) => [
                      ...current,
                      createEmptyAudioDraft(),
                    ])
                  }
                  className="text-xs text-zinc-500 hover:text-black"
                >
                  + Audio
                </button>
              </div>
            </div>

            {drafts.map((draft, index) => (
              <DraftItemEditor
                key={draft.id}
                index={index}
                draft={draft}
                onChange={(next) => updateDraft(draft.id, next)}
                onRemove={() => removeDraft(draft.id)}
                disabled={submitting}
              />
            ))}
          </div>

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
              disabled={submitting || !todoName.trim()}
              className="flex-1 rounded-md bg-black py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create List"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
