import { isAdminAuthed } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";
import SilverSparkles from "@/components/SilverSparkles";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
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

  const { data, error } = await supabaseAdmin
    .from("attendees")
    .select("id, nombre, apellido, localidad, telefono, created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="relative flex flex-1 flex-col items-center overflow-hidden bg-black">
      <SilverSparkles />
      <Dashboard attendees={error ? [] : data ?? []} />
    </main>
  );
}
