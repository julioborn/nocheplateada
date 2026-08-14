import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isValidLocalidad } from "@/lib/santa-fe-localidades";

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? null;
}

function isValidFechaNacimiento(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    return false;
  }
  const now = new Date();
  return y >= now.getFullYear() - 100 && date <= now;
}

export async function GET(request: NextRequest) {
  const deviceId = request.nextUrl.searchParams.get("deviceId");
  if (!deviceId) {
    return NextResponse.json({ registered: false });
  }

  const { data } = await supabaseAdmin
    .from("attendees")
    .select("nombre")
    .eq("device_id", deviceId)
    .maybeSingle();

  return NextResponse.json({ registered: !!data, nombre: data?.nombre ?? null });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const nombre = String(body.nombre ?? "").trim();
  const apellido = String(body.apellido ?? "").trim();
  const localidad = String(body.localidad ?? "").trim();
  const telefono = String(body.telefono ?? "").trim();
  const fechaNacimiento = String(body.fechaNacimiento ?? "").trim();
  const deviceId = body.deviceId ? String(body.deviceId).trim() : null;

  if (
    !nombre ||
    !apellido ||
    !isValidLocalidad(localidad) ||
    !isValidFechaNacimiento(fechaNacimiento)
  ) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }

  if (deviceId) {
    const { data: existing } = await supabaseAdmin
      .from("attendees")
      .select("id")
      .eq("device_id", deviceId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "duplicate_device" }, { status: 409 });
    }
  }

  const { error } = await supabaseAdmin.from("attendees").insert({
    nombre: nombre.toLocaleUpperCase("es"),
    apellido: apellido.toLocaleUpperCase("es"),
    localidad,
    telefono: telefono || null,
    fecha_nacimiento: fechaNacimiento,
    device_id: deviceId,
    ip_address: getClientIp(request),
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "duplicate_device" }, { status: 409 });
    }
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
