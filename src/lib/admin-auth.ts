import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

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

export function checkPassword(password: string) {
  if (!password || !process.env.ADMIN_PASSWORD) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(process.env.ADMIN_PASSWORD);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
