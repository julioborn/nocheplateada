"use server";

import { isAdminAuthed } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type SorteoNombre = {
  id: string;
  nombre: string;
  apellido: string;
  localidad: string;
};

export async function getNombresParaSorteo(): Promise<SorteoNombre[]> {
  if (!(await isAdminAuthed())) return [];

  const { data } = await supabaseAdmin
    .from("attendees")
    .select("id, nombre, apellido, localidad");

  return data ?? [];
}
