"use client";

import type { Attendee } from "./actions";

export default function ConfirmDeleteModal({
  attendee,
  pending,
  onConfirm,
  onCancel,
}: {
  attendee: Attendee;
  pending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border-2 border-zinc-600 bg-zinc-950/95 p-7 text-center shadow-[0_0_60px_rgba(160,170,190,0.2)]"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-red-500/50 text-red-400">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </div>

        <h3 className="mt-4 bg-linear-to-b from-zinc-100 to-zinc-400 bg-clip-text text-lg font-bold uppercase tracking-wide text-transparent">
          Eliminar inscripto
        </h3>
        <p className="mt-2 text-sm text-zinc-400">
          ¿Seguro que querés eliminar a{" "}
          <span className="font-semibold text-zinc-200">
            {attendee.nombre} {attendee.apellido}
          </span>
          ? Esta acción no se puede deshacer.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="flex-1 rounded-full border border-zinc-600 px-5 py-2.5 text-sm font-semibold uppercase tracking-widest text-zinc-300 transition hover:border-zinc-400 hover:text-white disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="flex-1 rounded-full border border-red-500/60 bg-red-600/90 px-5 py-2.5 text-sm font-semibold uppercase tracking-widest text-white shadow-[0_0_20px_rgba(220,38,38,0.35)] transition hover:bg-red-600 disabled:opacity-60"
          >
            {pending ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
