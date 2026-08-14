import { isAdminAuthed } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { ageRangeToBirthDateRange } from "@/lib/age";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";
import SilverSparkles from "@/components/SilverSparkles";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    localidad?: string;
    edadMin?: string;
    edadMax?: string;
  }>;
}) {
  const authed = await isAdminAuthed();

  if (!authed) {
    return (
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-black px-6 py-16">
        <SilverSparkles />
        <div className="relative z-10">
          <LoginForm />
        </div>
      </main>
    );
  }

  const params = await searchParams;
  const localidad = params.localidad?.trim() ?? "";
  const edadMin = params.edadMin?.trim() ?? "";
  const edadMax = params.edadMax?.trim() ?? "";
  const page = Math.max(1, Number(params.page) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { minBirthDate, maxBirthDate } = ageRangeToBirthDateRange(
    edadMin ? Number(edadMin) : undefined,
    edadMax ? Number(edadMax) : undefined
  );

  let listQuery = supabaseAdmin
    .from("attendees")
    .select("id, nombre, apellido, localidad, telefono, fecha_nacimiento, created_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(from, to);
  if (localidad) listQuery = listQuery.eq("localidad", localidad);
  if (maxBirthDate) listQuery = listQuery.lte("fecha_nacimiento", maxBirthDate);
  if (minBirthDate) listQuery = listQuery.gte("fecha_nacimiento", minBirthDate);

  const [{ data: attendees, count, error }, { data: localidadRows }] = await Promise.all([
    listQuery,
    supabaseAdmin.from("attendees").select("localidad"),
  ]);

  const localidadOptions = [...new Set((localidadRows ?? []).map((r) => r.localidad))].sort(
    (a, b) => a.localeCompare(b, "es")
  );

  return (
    <main className="relative flex flex-1 flex-col items-center overflow-hidden bg-black">
      <SilverSparkles />
      <Dashboard
        attendees={error ? [] : attendees ?? []}
        total={count ?? 0}
        page={page}
        pageSize={PAGE_SIZE}
        localidad={localidad}
        localidadOptions={localidadOptions}
        edadMin={edadMin}
        edadMax={edadMax}
      />
    </main>
  );
}
