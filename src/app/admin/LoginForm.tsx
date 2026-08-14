"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <form
      action={formAction}
      className="flex w-full max-w-xs flex-col gap-4 rounded-2xl border border-zinc-700/60 bg-zinc-950/60 p-6"
    >
      <label className="flex flex-col gap-1.5 text-left">
        <span className="text-xs uppercase tracking-widest text-zinc-400">
          Contraseña
        </span>
        <input
          type="password"
          name="password"
          required
          autoFocus
          className="rounded-lg border border-zinc-700 bg-black/60 px-4 py-2.5 text-zinc-100 outline-none transition focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300"
        />
      </label>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex items-center justify-center rounded-full border border-zinc-400/60 bg-gradient-to-b from-zinc-100 to-zinc-300 px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black disabled:opacity-60"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
