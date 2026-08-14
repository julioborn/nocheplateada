"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { logout, sortearGanador, type Attendee } from "./actions";

export default function Dashboard({
  attendees,
  total,
  page,
  pageSize,
  localidad,
  localidadOptions,
}: {
  attendees: Attendee[];
  total: number;
  page: number;
  pageSize: number;
  localidad: string;
  localidadOptions: string[];
}) {
  const router = useRouter();
  const [winner, setWinner] = useState<Attendee | null>(null);
  const [sorting, startSorteo] = useTransition();

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function buildHref(overrides: { page?: number; localidad?: string }) {
    const params = new URLSearchParams();
    const nextLocalidad = overrides.localidad ?? localidad;
    const nextPage = overrides.page ?? page;
    if (nextLocalidad) params.set("localidad", nextLocalidad);
    if (nextPage > 1) params.set("page", String(nextPage));
    const qs = params.toString();
    return `/admin${qs ? `?${qs}` : ""}`;
  }

  function handleFilterChange(value: string) {
    router.push(buildHref({ localidad: value, page: 1 }));
  }

  function sortear() {
    setWinner(null);
    startSorteo(async () => {
      const pick = await sortearGanador(localidad);
      setWinner(pick);
    });
  }

  const exportQs = localidad ? `?localidad=${encodeURIComponent(localidad)}` : "";

  return (
    <div className="relative z-10 w-full max-w-5xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="bg-linear-to-b from-zinc-200 to-zinc-400 bg-clip-text text-2xl font-bold uppercase tracking-wide text-transparent">
          Noche Plateada — Admin
        </h1>
        <form action={logout}>
          <button className="text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-300">
            Salir
          </button>
        </form>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Inscriptos" value={total} />
        <StatCard label="Localidades" value={localidadOptions.length} />
        <a
          href={`/api/admin/export/excel${exportQs}`}
          className="flex flex-col justify-center rounded-xl border border-zinc-700/60 bg-zinc-950/60 px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-zinc-300 hover:border-zinc-400 hover:text-white"
        >
          Descargar Excel
        </a>
        <a
          href={`/api/admin/export/pdf${exportQs}`}
          className="flex flex-col justify-center rounded-xl border border-zinc-700/60 bg-zinc-950/60 px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-zinc-300 hover:border-zinc-400 hover:text-white"
        >
          Descargar PDF
        </a>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400">
          Filtrar por localidad
          <select
            value={localidad}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-black/60 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-300"
          >
            <option value="">Todas</option>
            {localidadOptions.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </label>
        {localidad && (
          <Link
            href={buildHref({ localidad: "", page: 1 })}
            className="text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-300"
          >
            Quitar filtro
          </Link>
        )}
      </div>

      <div className="mb-8 rounded-2xl border border-zinc-700/60 bg-zinc-950/60 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-300">
              Sorteo{localidad ? ` — ${localidad}` : ""}
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
            disabled={sorting || total === 0}
            className="inline-flex items-center justify-center rounded-full border border-zinc-400/60 bg-linear-to-b from-zinc-100 to-zinc-300 px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.2em] text-black disabled:opacity-60"
          >
            {sorting ? "Sorteando..." : "Sortear ganador"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-700/60 bg-zinc-950/60">
        <div className="overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950 text-xs uppercase tracking-widest text-zinc-500">
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
                    No hay inscriptos{localidad ? " en esta localidad" : ""} todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-800/80 px-4 py-3 text-xs uppercase tracking-widest text-zinc-400">
          <Link
            aria-disabled={page <= 1}
            href={buildHref({ page: page - 1 })}
            className={`rounded-lg border border-zinc-700 px-3 py-1.5 ${
              page <= 1 ? "pointer-events-none opacity-30" : "hover:border-zinc-400 hover:text-white"
            }`}
          >
            Anterior
          </Link>
          <span>
            Página {page} de {totalPages}
          </span>
          <Link
            aria-disabled={page >= totalPages}
            href={buildHref({ page: page + 1 })}
            className={`rounded-lg border border-zinc-700 px-3 py-1.5 ${
              page >= totalPages
                ? "pointer-events-none opacity-30"
                : "hover:border-zinc-400 hover:text-white"
            }`}
          >
            Siguiente
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-zinc-700/60 bg-zinc-950/60 px-4 py-3 text-center">
      <div className="bg-linear-to-b from-zinc-200 to-zinc-400 bg-clip-text text-2xl font-bold text-transparent">
        {value}
      </div>
      <div className="text-xs uppercase tracking-widest text-zinc-500">{label}</div>
    </div>
  );
}
