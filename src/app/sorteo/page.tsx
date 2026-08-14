import { isAdminAuthed } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import LoginForm from "../admin/LoginForm";
import SilverSparkles from "@/components/SilverSparkles";
import Logo from "@/components/Logo";
import SorteoView from "./SorteoView";
import { getNombresParaSorteo } from "./actions";

export const dynamic = "force-dynamic";

export default async function SorteoPage({
  searchParams,
}: {
  searchParams: Promise<{ localidad?: string }>;
}) {
  const authed = await isAdminAuthed();

  if (!authed) {
    return (
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-black px-6 py-16">
        <SilverSparkles />
        <div className="relative z-10 flex flex-col items-center">
          <Logo className="mb-8 w-48" />
          <LoginForm />
        </div>
      </main>
    );
  }

  const params = await searchParams;
  const localidad = params.localidad?.trim() ?? "";

  const [nombres, { data: localidadRows }] = await Promise.all([
    getNombresParaSorteo(localidad),
    supabaseAdmin.from("attendees").select("localidad"),
  ]);

  const localidadOptions = [...new Set((localidadRows ?? []).map((r) => r.localidad))].sort(
    (a, b) => a.localeCompare(b, "es")
  );

  return (
    <main className="relative flex flex-1 flex-col items-center overflow-hidden bg-black">
      <SilverSparkles />
      <SorteoView
        nombres={nombres}
        localidad={localidad}
        localidadOptions={localidadOptions}
      />
    </main>
  );
}
