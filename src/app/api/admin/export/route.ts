import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("attendees")
    .select("nombre, apellido, localidad, telefono, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const header = "Nombre,Apellido,Localidad,Telefono,Fecha\n";
  const rows = (data ?? [])
    .map((a) =>
      [a.nombre, a.apellido, a.localidad, a.telefono ?? "", a.created_at]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  return new NextResponse(header + rows, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="noche-plateada-inscriptos.csv"',
    },
  });
}
