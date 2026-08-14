import Logo from "@/components/Logo";
import SilverSparkles from "@/components/SilverSparkles";

export default function InfoLanding() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-black px-6 py-16">
      <SilverSparkles />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center text-center">
        <Logo className="mt-4" />

        <div className="mt-10 flex w-full flex-col gap-4 rounded-2xl border border-zinc-700/60 bg-zinc-950 p-6">
          <InfoRow label="Fecha" value="Próximamente" />
          <InfoRow label="Lugar" value="Próximamente" />
          <InfoRow label="Horario" value="Próximamente" />
        </div>

        <p className="mt-8 max-w-xs text-sm text-zinc-500">
          Muy pronto vas a poder registrarte acá para participar de los sorteos.
        </p>
      </div>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-zinc-800 pb-3 text-left last:border-b-0 last:pb-0">
      <span className="text-xs uppercase tracking-widest text-zinc-500">{label}</span>
      <span className="text-lg font-semibold text-zinc-100">{value}</span>
    </div>
  );
}
