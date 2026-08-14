"use client";

import { useActionState, useState } from "react";
import { login } from "./actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined);
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      action={formAction}
      className="flex w-full max-w-md flex-col gap-6 rounded-2xl border-2 border-zinc-500 bg-zinc-950/90 p-8 shadow-[0_0_50px_rgba(160,170,190,0.15)] backdrop-blur sm:p-10"
    >
      <label className="flex flex-col gap-2 text-left">
        <span className="text-sm font-semibold uppercase tracking-widest text-zinc-300">
          Usuario
        </span>
        <input
          type="text"
          name="username"
          required
          autoFocus
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          className="rounded-lg border-2 border-zinc-600 bg-black px-5 py-3.5 text-base text-zinc-100 outline-none transition focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300"
        />
      </label>

      <label className="flex flex-col gap-2 text-left">
        <span className="text-sm font-semibold uppercase tracking-widest text-zinc-300">
          Contraseña
        </span>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          required
          autoComplete="current-password"
          className="rounded-lg border-2 border-zinc-600 bg-black px-5 py-3.5 text-base text-zinc-100 outline-none transition focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300"
        />
      </label>

      <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
        <input
          type="checkbox"
          checked={showPassword}
          onChange={(e) => setShowPassword(e.target.checked)}
          className="h-4 w-4 rounded border-2 border-zinc-500 bg-black accent-zinc-300"
        />
        Mostrar contraseña
      </label>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex items-center justify-center rounded-full border border-zinc-400/60 bg-linear-to-b from-zinc-100 to-zinc-300 px-8 py-3.5 text-base font-semibold uppercase tracking-[0.2em] text-black disabled:opacity-60"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
