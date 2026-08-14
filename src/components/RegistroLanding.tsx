import Link from "next/link";
import Logo from "@/components/Logo";
import SilverSparkles from "@/components/SilverSparkles";

export default function RegistroLanding() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-black px-6 py-16">
      <SilverSparkles />

      <div className="relative z-10 flex flex-col items-center text-center">
        <Logo className="mt-8" />

        <p className="mt-14 max-w-xs text-sm tracking-widest text-zinc-400 uppercase">
          Registrate para participar de sorteos
        </p>

        <Link
          href="/registro"
          className="mt-6 inline-flex items-center justify-center rounded-full border border-zinc-400/60 bg-linear-to-b from-zinc-100 to-zinc-300 px-10 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black shadow-[0_0_25px_rgba(200,210,225,0.35)] transition hover:shadow-[0_0_35px_rgba(200,210,225,0.55)] active:scale-[0.98]"
        >
          Registrarte
        </Link>
      </div>
    </main>
  );
}
