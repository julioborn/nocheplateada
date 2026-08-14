"use client";

import { formatDni } from "@/components/DniField";
import { calcAge } from "@/lib/age";
import type { Attendee } from "../actions";

function formatFecha(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default function WinnerDetailsModal({
  winner,
  onClose,
}: {
  winner: Attendee;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border-2 border-zinc-600 bg-zinc-950/95 p-7 shadow-[0_0_60px_rgba(160,170,190,0.2)]"
      >
        <p className="text-center text-xs uppercase tracking-widest text-zinc-500">Ganador</p>
        <h3 className="mt-1 bg-linear-to-b from-zinc-100 to-zinc-400 bg-clip-text text-center text-2xl font-bold uppercase text-transparent">
          {winner.nombre} {winner.apellido}
        </h3>

        <div className="mt-6 flex flex-col gap-3">
          <DetailRow label="DNI" value={formatDni(winner.dni)} />
          <DetailRow label="Localidad" value={winner.localidad} />
          <DetailRow
            label="Fecha de nacimiento"
            value={`${formatFecha(winner.fecha_nacimiento)} (${calcAge(winner.fecha_nacimiento)} años)`}
          />
          <DetailRow label="Teléfono" value={winner.telefono ?? "—"} />
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-7 w-full rounded-full border border-zinc-600 px-5 py-2.5 text-sm font-semibold uppercase tracking-widest text-zinc-300 transition hover:border-zinc-400 hover:text-white"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800 pb-2 last:border-b-0 last:pb-0">
      <span className="text-xs uppercase tracking-widest text-zinc-500">{label}</span>
      <span className="text-sm font-semibold text-zinc-100">{value}</span>
    </div>
  );
}
