"use client";

import { deletePost } from "../actions";

export function DeletePostButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deletePost}
      onSubmit={(e) => {
        if (!confirm(`¿Eliminar “${title}”? Esta acción no se puede deshacer.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="rounded-full border border-red-700/30 px-3 py-1 text-red-700 hover:border-red-700">
        Eliminar
      </button>
    </form>
  );
}
