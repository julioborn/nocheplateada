"use server";

import { isAdminAuthed } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type SorteoNombre = {
  id: string;
  nombre: string;
  apellido: string;
  localidad: string;
};

export async function getNombresParaSorteo(localidad: string): Promise<SorteoNombre[]> {
  if (!(await isAdminAuthed())) return [];

  let query = supabaseAdmin.from("attendees").select("id, nombre, apellido, localidad");
  if (localidad) query = query.eq("localidad", localidad);

  const { data } = await query;
  return data ?? [];
}
