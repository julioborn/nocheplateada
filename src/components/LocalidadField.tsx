"use client";

import { useMemo, useState } from "react";
import { SANTA_FE_LOCALIDADES, normalizeLocalidad } from "@/lib/santa-fe-localidades";

export default function LocalidadField({
  value,
  onChange,
  invalid,
}: {
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);

  const matches = useMemo(() => {
    const q = normalizeLocalidad(value);
    if (!q) return [];
    return SANTA_FE_LOCALIDADES.filter((loc) => normalizeLocalidad(loc).includes(q)).slice(0, 8);
  }, [value]);

  function select(loc: string) {
    onChange(loc);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || matches.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % matches.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + matches.length) % matches.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      select(matches[highlight]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative flex flex-col gap-1.5 text-left">
      <span className="text-xs uppercase tracking-widest text-zinc-400">Localidad</span>
      <input
        type="text"
        required
        autoComplete="off"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setHighlight(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={handleKeyDown}
        placeholder="Empezá a escribir..."
        className={`rounded-lg border bg-black/60 px-4 py-2.5 text-zinc-100 outline-none transition focus:ring-1 ${
          invalid
            ? "border-red-500 focus:border-red-400 focus:ring-red-400"
            : "border-zinc-700 focus:border-zinc-300 focus:ring-zinc-300"
        }`}
      />
      {open && matches.length > 0 && (
        <ul className="absolute top-full z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-zinc-700 bg-zinc-950/95 shadow-lg backdrop-blur">
          {matches.map((loc, i) => (
            <li key={loc}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => select(loc)}
                className={`w-full px-4 py-2 text-left text-sm ${
                  i === highlight
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-300 hover:bg-zinc-800/70"
                }`}
              >
                {loc}
              </button>
            </li>
          ))}
        </ul>
      )}
      {invalid && (
        <span className="text-xs text-red-400">
          Elegí una localidad de la lista (provincia de Santa Fe)
        </span>
      )}
    </div>
  );
}
