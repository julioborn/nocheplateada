"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE_NAME, checkCredentials, isAdminAuthed, makeSessionToken } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function login(_prevState: { error?: string } | undefined, formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!(await checkCredentials(username, password))) {
    return { error: "Usuario o contraseña incorrectos" };
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE_NAME, makeSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 3,
  });

  redirect("/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE_NAME);
  redirect("/admin");
}

export type Attendee = {
  id: string;
  nombre: string;
  apellido: string;
  localidad: string;
  telefono: string | null;
  created_at: string;
};

export async function sortearGanador(localidad: string): Promise<Attendee | null> {
  if (!(await isAdminAuthed())) return null;

  let countQuery = supabaseAdmin
    .from("attendees")
    .select("*", { count: "exact", head: true });
  if (localidad) countQuery = countQuery.eq("localidad", localidad);
  const { count } = await countQuery;

  if (!count) return null;

  const offset = Math.floor(Math.random() * count);

  let rowQuery = supabaseAdmin
    .from("attendees")
    .select("id, nombre, apellido, localidad, telefono, created_at")
    .range(offset, offset);
  if (localidad) rowQuery = rowQuery.eq("localidad", localidad);

  const { data } = await rowQuery;
  return data?.[0] ?? null;
}

export async function eliminarAsistente(id: string) {
  if (!(await isAdminAuthed())) return { error: "No autorizado" };

  const { error } = await supabaseAdmin.from("attendees").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin");
  return { ok: true };
}
