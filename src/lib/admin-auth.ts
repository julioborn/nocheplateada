import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const ADMIN_COOKIE_NAME = "np_admin_session";

function sign(value: string) {
  return createHmac("sha256", process.env.SESSION_SECRET!)
    .update(value)
    .digest("hex");
}

export function makeSessionToken() {
  return sign("admin-session");
}

export async function isAdminAuthed() {
  const store = await cookies();
  const cookie = store.get(ADMIN_COOKIE_NAME)?.value;
  if (!cookie) return false;

  const expected = makeSessionToken();
  const a = Buffer.from(cookie);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function checkCredentials(username: string, password: string) {
  if (!username || !password) return false;

  const { data } = await supabaseAdmin
    .from("admin_users")
    .select("password_hash")
    .eq("username", username.trim().toLowerCase())
    .maybeSingle();

  if (!data) return false;
  return bcrypt.compare(password, data.password_hash);
}
