"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import SilverSparkles from "@/components/SilverSparkles";
import LocalidadField from "@/components/LocalidadField";
import { isValidLocalidad } from "@/lib/santa-fe-localidades";
import { getDeviceId } from "@/lib/device-id";

export default function RegistroPage() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [status, setStatus] = useState<
    "checking" | "idle" | "loading" | "success" | "error" | "already"
  >("checking");
  const [error, setError] = useState("");
  const [localidadInvalid, setLocalidadInvalid] = useState(false);

  useEffect(() => {
    const deviceId = getDeviceId();
    fetch(`/api/registro?deviceId=${encodeURIComponent(deviceId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.registered) {
          if (data.nombre) setNombre(data.nombre);
          setStatus("already");
        } else {
          setStatus("idle");
        }
      })
      .catch(() => setStatus("idle"));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!isValidLocalidad(localidad)) {
      setLocalidadInvalid(true);
      return;
    }
    setLocalidadInvalid(false);

    setStatus("loading");
    setError("");

    const res = await fetch("/api/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        apellido,
        localidad,
        telefono,
        deviceId: getDeviceId(),
      }),
    });

    if (res.status === 409) {
      setStatus("already");
      return;
    }

    if (!res.ok) {
      setStatus("error");
      setError("No se pudo completar el registro. Probá de nuevo.");
      return;
    }

    setStatus("success");
  }

  if (status === "checking") {
    return (
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-black px-6 py-16">
        <SilverSparkles />
      </main>
    );
  }

  if (status === "already") {
    return (
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-black px-6 py-16">
        <SilverSparkles />
        <div className="relative z-10 flex flex-col items-center text-center">
          <Logo className="mt-8 scale-75" />
          <h2 className="mt-10 bg-linear-to-b from-zinc-200 to-zinc-400 bg-clip-text text-2xl font-bold uppercase tracking-wide text-transparent">
            Ya estás registrado
          </h2>
          <p className="mt-3 max-w-xs text-sm text-zinc-400">
            Este dispositivo ya se registró para la Noche Plateada.
            <br />
            Disfrutá de la Noche Plateada.
          </p>
        </div>
      </main>
    );
  }

  if (status === "success") {
    return (
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-black px-6 py-16">
        <SilverSparkles />
        <div className="relative z-10 flex flex-col items-center text-center">
          <Logo className="mt-8 scale-75" />
          <h2 className="mt-10 bg-linear-to-b from-zinc-200 to-zinc-400 bg-clip-text text-2xl font-bold uppercase tracking-wide text-transparent">
            Bienvenido {nombre}
          </h2>
          <p className="mt-3 max-w-xs text-sm text-zinc-400">
            Disfrutá de la Noche Plateada.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-black px-6 pt-8 pb-16">
      <SilverSparkles />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center">
        <Logo className="scale-[0.65] sm:scale-75" />

        <form
          onSubmit={handleSubmit}
          className="mt-4 flex w-full flex-col gap-4 rounded-2xl border border-zinc-700/60 bg-zinc-950/60 p-6 shadow-[0_0_40px_rgba(160,170,190,0.08)] backdrop-blur"
        >
          <Field
            label="Nombre"
            value={nombre}
            onChange={setNombre}
            required
            autoFocus
          />
          <Field label="Apellido" value={apellido} onChange={setApellido} required />
          <LocalidadField
            value={localidad}
            onChange={(v) => {
              setLocalidad(v);
              if (localidadInvalid) setLocalidadInvalid(false);
            }}
            invalid={localidadInvalid}
          />
          <Field
            label="Teléfono (opcional)"
            value={telefono}
            onChange={setTelefono}
            type="tel"
          />

          {status === "error" && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-2 inline-flex items-center justify-center rounded-full border border-zinc-400/60 bg-linear-to-b from-zinc-100 to-zinc-300 px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black shadow-[0_0_25px_rgba(200,210,225,0.35)] transition hover:shadow-[0_0_35px_rgba(200,210,225,0.55)] active:scale-[0.98] disabled:opacity-60"
          >
            {status === "loading" ? "Enviando..." : "Confirmar"}
          </button>
        </form>

        <Link href="/" className="mt-6 text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-300">
          Volver
        </Link>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  autoFocus,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  autoFocus?: boolean;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-left">
      <span className="text-xs uppercase tracking-widest text-zinc-400">{label}</span>
      <input
        type={type}
        required={required}
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-zinc-700 bg-black/60 px-4 py-2.5 text-zinc-100 outline-none transition focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300"
      />
    </label>
  );
}
