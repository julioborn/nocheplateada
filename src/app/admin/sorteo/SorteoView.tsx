"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "@/components/Logo";
import { sortearGanador } from "../actions";
import type { SorteoNombre } from "./actions";

const TOTAL_TICKS = 32;

export default function SorteoView({ nombres }: { nombres: SorteoNombre[] }) {
  const [phase, setPhase] = useState<"idle" | "spinning" | "result">("idle");
  const [display, setDisplay] = useState<SorteoNombre | null>(null);
  const [tick, setTick] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  async function handleSortear() {
    if (nombres.length === 0 || phase === "spinning") return;
    setPhase("spinning");

    const winner = await sortearGanador("");
    if (!winner) {
      setPhase("idle");
      return;
    }

    let currentTick = 0;

    function step() {
      currentTick++;
      setTick(currentTick);

      if (currentTick >= TOTAL_TICKS) {
        setDisplay({
          id: winner!.id,
          nombre: winner!.nombre,
          apellido: winner!.apellido,
          localidad: winner!.localidad,
        });
        setPhase("result");
        return;
      }

      const pick = nombres[Math.floor(Math.random() * nombres.length)];
      setDisplay(pick);

      const progress = currentTick / TOTAL_TICKS;
      const delay = 50 + Math.pow(progress, 3) * 450;
      timeoutRef.current = setTimeout(step, delay);
    }

    step();
  }

  return (
    <div className="relative z-10 flex w-full max-w-2xl flex-col items-center px-4 py-10">
      <div className="w-40 sm:w-48">
        <Logo />
      </div>

      <div className="mt-10 flex h-56 w-full items-center justify-center rounded-2xl border-2 border-zinc-600 bg-zinc-950 px-6 shadow-[0_0_60px_rgba(160,170,190,0.15)]">
        {nombres.length === 0 ? (
          <p className="text-center text-sm text-zinc-500">No hay inscriptos para sortear.</p>
        ) : phase === "idle" ? (
          <p className="text-center text-sm uppercase tracking-widest text-zinc-500">
            Presioná sortear para elegir un ganador
          </p>
        ) : (
          <div
            key={phase === "result" ? "result" : tick}
            className={`text-center ${phase === "result" ? "sorteo-winner" : "sorteo-tick"}`}
          >
            {phase === "result" && (
              <p className="mb-2 text-sm uppercase tracking-widest text-zinc-400">
                🎉 Ganador 🎉
              </p>
            )}
            <p
              className={`bg-linear-to-b from-zinc-100 to-zinc-400 bg-clip-text font-black uppercase text-transparent ${
                phase === "result" ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"
              }`}
            >
              {display?.nombre} {display?.apellido}
            </p>
            {phase === "result" && display && (
              <p className="mt-2 text-sm text-zinc-400">{display.localidad}</p>
            )}
          </div>
        )}
      </div>

      <button
        onClick={handleSortear}
        disabled={nombres.length === 0 || phase === "spinning"}
        className="mt-8 inline-flex items-center justify-center rounded-full border border-zinc-400/60 bg-linear-to-b from-zinc-100 to-zinc-300 px-10 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black shadow-[0_0_25px_rgba(200,210,225,0.35)] transition hover:shadow-[0_0_35px_rgba(200,210,225,0.55)] active:scale-[0.98] disabled:opacity-50"
      >
        {phase === "spinning"
          ? "Sorteando..."
          : phase === "result"
            ? "Sortear de nuevo"
            : "Sortear"}
      </button>
    </div>
  );
}
