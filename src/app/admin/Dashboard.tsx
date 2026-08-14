"use client";

import { useMemo, useState } from "react";
import { logout } from "./actions";

type Attendee = {
  id: string;
  nombre: string;
  apellido: string;
  localidad: string;
  telefono: string | null;
  created_at: string;
};

export default function Dashboard({ attendees }: { attendees: Attendee[] }) {
  const [winner, setWinner] = useState<Attendee | null>(null);

  const byLocalidad = useMemo(() => {
    const counts = new Map<string, number>();
    for (const a of attendees) {
      counts.set(a.localidad, (counts.get(a.localidad) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [attendees]);

  function sortear() {
    if (attendees.length === 0) return;
    const pick = attendees[Math.floor(Math.random() * attendees.length)];
    setWinner(pick);
  }

  return (
    <div className="relative z-10 w-full max-w-4xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="bg-gradient-to-b from-zinc-200 to-zinc-400 bg-clip-text text-2xl font-bold uppercase tracking-wide text-transparent">
          Noche Plateada — Admin
        </h1>
        <form action={logout}>
          <button className="text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-300">
            Salir
          </button>
        </form>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Total inscriptos" value={attendees.length} />
        <StatCard label="Localidades" value={byLocalidad.length} />
        <a
          href="/api/admin/export"
          className="flex flex-col justify-center rounded-xl border border-zinc-700/60 bg-zinc-950/60 px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-zinc-300 hover:border-zinc-400 hover:text-white"
        >
          Exportar CSV
        </a>
      </div>

      <div className="mb-8 rounded-2xl border border-zinc-700/60 bg-zinc-950/60 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-300">
              Sorteo
            </h2>
            {winner && (
              <p className="mt-2 text-lg text-white">
                🎉 {winner.nombre} {winner.apellido}{" "}
                <span className="text-zinc-400">({winner.localidad})</span>
              </p>
            )}
          </div>
          <button
            onClick={sortear}
            disabled={attendees.length === 0}
            className="inline-flex items-center justify-center rounded-full border border-zinc-400/60 bg-gradient-to-b from-zinc-100 to-zinc-300 px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.2em] text-black disabled:opacity-60"
          >
            Sortear ganador
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-700/60 bg-zinc-950/60">
        <div className="max-h-[420px] overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-zinc-950 text-xs uppercase tracking-widest text-zinc-500">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Apellido</th>
                <th className="px-4 py-3">Localidad</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Hora</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map((a) => (
                <tr key={a.id} className="border-t border-zinc-800/80">
                  <td className="px-4 py-2.5">{a.nombre}</td>
                  <td className="px-4 py-2.5">{a.apellido}</td>
                  <td className="px-4 py-2.5">{a.localidad}</td>
                  <td className="px-4 py-2.5 text-zinc-400">{a.telefono ?? "—"}</td>
                  <td className="px-4 py-2.5 text-zinc-500">
                    {new Date(a.created_at).toLocaleTimeString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
              {attendees.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                    Todavía no hay inscriptos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-zinc-700/60 bg-zinc-950/60 px-4 py-3 text-center">
      <div className="bg-gradient-to-b from-zinc-200 to-zinc-400 bg-clip-text text-2xl font-bold text-transparent">
        {value}
      </div>
      <div className="text-xs uppercase tracking-widest text-zinc-500">{label}</div>
    </div>
  );
}
