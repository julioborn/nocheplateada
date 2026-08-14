"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setShowRegistro } from "./actions";

export default function RegistroToggle({ initialValue }: { initialValue: boolean }) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);
  const [pending, startTransition] = useTransition();

  function toggle() {
    const next = !value;
    setValue(next);
    startTransition(async () => {
      const result = await setShowRegistro(next);
      if (!result?.ok) {
        setValue(!next);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex items-center justify-between rounded-2xl border border-zinc-700/60 bg-zinc-950 p-6">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-300">
          Página de registro
        </h2>
        <p className="mt-1 text-xs text-zinc-500">
          {value
            ? "Activa: nocheplateada.com.ar muestra el formulario de registro."
            : "Apagada: nocheplateada.com.ar muestra la pantalla de información."}
        </p>
      </div>
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        aria-pressed={value}
        className={`relative h-8 w-14 shrink-0 rounded-full border transition disabled:opacity-60 ${
          value ? "border-zinc-300 bg-zinc-100" : "border-zinc-600 bg-zinc-800"
        }`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-black transition-transform ${
            value ? "translate-x-7" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
