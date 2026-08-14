"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { eliminarAsistente, logout, sortearGanador, type Attendee } from "./actions";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import Logo from "@/components/Logo";
import { calcAge } from "@/lib/age";
import { formatDni } from "@/components/DniField";

export default function Dashboard({
  attendees,
  total,
  page,
  pageSize,
  localidad,
  localidadOptions,
  edadMin,
  edadMax,
}: {
  attendees: Attendee[];
  total: number;
  page: number;
  pageSize: number;
  localidad: string;
  localidadOptions: string[];
  edadMin: string;
  edadMax: string;
}) {
  const router = useRouter();
  const [winner, setWinner] = useState<Attendee | null>(null);
  const [sorting, startSorteo] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [pendingDelete, setPendingDelete] = useState<Attendee | null>(null);
  const [, startDelete] = useTransition();
  const [edadMinInput, setEdadMinInput] = useState(edadMin);
  const [edadMaxInput, setEdadMaxInput] = useState(edadMax);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const visibleAttendees = attendees.filter((a) => !deletedIds.has(a.id));
  const hasAgeFilter = Boolean(edadMin || edadMax);

  function buildHref(overrides: {
    page?: number;
    localidad?: string;
    edadMin?: string;
    edadMax?: string;
  }) {
    const params = new URLSearchParams();
    const nextLocalidad = overrides.localidad ?? localidad;
    const nextEdadMin = overrides.edadMin ?? edadMin;
    const nextEdadMax = overrides.edadMax ?? edadMax;
    const nextPage = overrides.page ?? page;
    if (nextLocalidad) params.set("localidad", nextLocalidad);
    if (nextEdadMin) params.set("edadMin", nextEdadMin);
    if (nextEdadMax) params.set("edadMax", nextEdadMax);
    if (nextPage > 1) params.set("page", String(nextPage));
    const qs = params.toString();
    return `/admin${qs ? `?${qs}` : ""}`;
  }

  function handleFilterChange(value: string) {
    router.push(buildHref({ localidad: value, page: 1 }));
  }

  function applyAgeFilter() {
    router.push(buildHref({ edadMin: edadMinInput, edadMax: edadMaxInput, page: 1 }));
  }

  function clearAgeFilter() {
    setEdadMinInput("");
    setEdadMaxInput("");
    router.push(buildHref({ edadMin: "", edadMax: "", page: 1 }));
  }

  function sortear() {
    setWinner(null);
    startSorteo(async () => {
      const pick = await sortearGanador(localidad);
      setWinner(pick);
    });
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    const attendee = pendingDelete;

    setDeletingId(attendee.id);
    startDelete(async () => {
      const result = await eliminarAsistente(attendee.id);
      if (result?.ok) {
        setDeletedIds((prev) => new Set(prev).add(attendee.id));
        router.refresh();
      }
      setDeletingId(null);
      setPendingDelete(null);
    });
  }

  const exportParams = new URLSearchParams();
  if (localidad) exportParams.set("localidad", localidad);
  if (edadMin) exportParams.set("edadMin", edadMin);
  if (edadMax) exportParams.set("edadMax", edadMax);
  const exportQsString = exportParams.toString();
  const exportQs = exportQsString ? `?${exportQsString}` : "";

  function formatFecha(iso: string) {
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  }

  return (
    <div className="relative z-10 w-full max-w-5xl px-4 py-10">
      <div className="mx-auto mb-4 w-40 sm:w-48">
        <Logo />
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="bg-linear-to-b from-zinc-200 to-zinc-400 bg-clip-text text-sm font-semibold uppercase tracking-widest text-transparent">
          Administración
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
          className="flex flex-col justify-center rounded-xl border border-zinc-700/60 bg-zinc-950 px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-zinc-300 hover:border-zinc-400 hover:text-white"
        >
          Descargar Excel
        </a>
        <a
          href={`/api/admin/export/pdf${exportQs}`}
          className="flex flex-col justify-center rounded-xl border border-zinc-700/60 bg-zinc-950 px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-zinc-300 hover:border-zinc-400 hover:text-white"
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
            className="rounded-lg border border-zinc-700 bg-black px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-300"
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

        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400">
          Edad
          <input
            type="number"
            min={0}
            placeholder="Mín."
            value={edadMinInput}
            onChange={(e) => setEdadMinInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyAgeFilter()}
            className="w-20 rounded-lg border border-zinc-700 bg-black px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-300"
          />
          <span className="text-zinc-600">—</span>
          <input
            type="number"
            min={0}
            placeholder="Máx."
            value={edadMaxInput}
            onChange={(e) => setEdadMaxInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyAgeFilter()}
            className="w-20 rounded-lg border border-zinc-700 bg-black px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-300"
          />
          <button
            type="button"
            onClick={applyAgeFilter}
            className="rounded-lg border border-zinc-700 px-3 py-2 normal-case tracking-normal text-zinc-300 hover:border-zinc-400 hover:text-white"
          >
            Filtrar
          </button>
        </div>
        {hasAgeFilter && (
          <button
            type="button"
            onClick={clearAgeFilter}
            className="text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-300"
          >
            Quitar filtro de edad
          </button>
        )}
      </div>

      <div className="mb-8 rounded-2xl border border-zinc-700/60 bg-zinc-950 p-6">
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
          <div className="flex items-center gap-3">
            <Link
              href="/admin/sorteo"
              className="rounded-full border border-zinc-600 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300 hover:border-zinc-400 hover:text-white"
            >
              Vista completa
            </Link>
            <button
              onClick={sortear}
              disabled={sorting || total === 0}
              className="inline-flex items-center justify-center rounded-full border border-zinc-400/60 bg-linear-to-b from-zinc-100 to-zinc-300 px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.2em] text-black disabled:opacity-60"
            >
              {sorting ? "Sorteando..." : "Sortear ganador"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: stacked cards */}
      <div className="mb-4 flex flex-col gap-3 sm:hidden">
        {visibleAttendees.map((a) => (
          <div
            key={a.id}
            className="rounded-xl border border-zinc-700/60 bg-zinc-950 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-zinc-100">
                  {a.nombre} {a.apellido}
                </p>
                <p className="text-sm text-zinc-400">{a.localidad}</p>
                <p className="text-xs text-zinc-500">DNI {formatDni(a.dni)}</p>
              </div>
              <button
                onClick={() => setPendingDelete(a)}
                disabled={deletingId === a.id}
                className="shrink-0 rounded-full border border-red-500/40 px-3 py-1 text-xs uppercase tracking-widest text-red-400 hover:bg-red-500/10 disabled:opacity-50"
              >
                {deletingId === a.id ? "..." : "Eliminar"}
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
              <span>{a.telefono ?? "Sin teléfono"}</span>
              <span>
                {new Date(a.created_at).toLocaleTimeString("es-AR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="mt-1 text-xs text-zinc-500">
              Nac. {formatFecha(a.fecha_nacimiento)} ({calcAge(a.fecha_nacimiento)} años)
            </div>
          </div>
        ))}
        {visibleAttendees.length === 0 && (
          <p className="rounded-xl border border-zinc-700/60 bg-zinc-950 p-6 text-center text-sm text-zinc-500">
            No hay inscriptos{localidad ? " en esta localidad" : ""} todavía.
          </p>
        )}
      </div>

      {/* Desktop: table */}
      <div className="mb-8 hidden rounded-2xl border border-zinc-700/60 bg-zinc-950 sm:block">
        <div className="overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950 text-xs uppercase tracking-widest text-zinc-500">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Apellido</th>
                <th className="px-4 py-3">Localidad</th>
                <th className="px-4 py-3">DNI</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">F. Nac.</th>
                <th className="px-4 py-3">Edad</th>
                <th className="px-4 py-3">Hora</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {visibleAttendees.map((a) => (
                <tr key={a.id} className="border-t border-zinc-800/80">
                  <td className="px-4 py-2.5">{a.nombre}</td>
                  <td className="px-4 py-2.5">{a.apellido}</td>
                  <td className="px-4 py-2.5">{a.localidad}</td>
                  <td className="px-4 py-2.5 text-zinc-400">{formatDni(a.dni)}</td>
                  <td className="px-4 py-2.5 text-zinc-400">{a.telefono ?? "—"}</td>
                  <td className="px-4 py-2.5 text-zinc-400">{formatFecha(a.fecha_nacimiento)}</td>
                  <td className="px-4 py-2.5 text-zinc-400">{calcAge(a.fecha_nacimiento)}</td>
                  <td className="px-4 py-2.5 text-zinc-500">
                    {new Date(a.created_at).toLocaleTimeString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      onClick={() => setPendingDelete(a)}
                      disabled={deletingId === a.id}
                      className="rounded-full border border-red-500/40 px-3 py-1 text-xs uppercase tracking-widest text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                    >
                      {deletingId === a.id ? "..." : "Eliminar"}
                    </button>
                  </td>
                </tr>
              ))}
              {visibleAttendees.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-zinc-500">
                    No hay inscriptos{localidad ? " en esta localidad" : ""} todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-zinc-700/60 bg-zinc-950 px-4 py-3 text-xs uppercase tracking-widest text-zinc-400">
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

      {pendingDelete && (
        <ConfirmDeleteModal
          attendee={pendingDelete}
          pending={deletingId === pendingDelete.id}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-zinc-700/60 bg-zinc-950 px-4 py-3 text-center">
      <div className="bg-linear-to-b from-zinc-200 to-zinc-400 bg-clip-text text-2xl font-bold text-transparent">
        {value}
      </div>
      <div className="text-xs uppercase tracking-widest text-zinc-500">{label}</div>
    </div>
  );
}
