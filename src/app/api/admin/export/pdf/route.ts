import { NextRequest, NextResponse } from "next/server";
import path from "path";
import PDFDocument from "pdfkit";
import { isAdminAuthed } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

const COLUMNS = [
  { key: "nombre", label: "Nombre", x: 40, width: 85 },
  { key: "apellido", label: "Apellido", x: 125, width: 85 },
  { key: "localidad", label: "Localidad", x: 210, width: 110 },
  { key: "telefono", label: "Teléfono", x: 320, width: 75 },
  { key: "fechaNacimiento", label: "Nac.", x: 395, width: 65 },
  { key: "fechaHora", label: "Fecha / hora", x: 460, width: 95 },
] as const;

const TABLE_TOP = 150;
const ROW_HEIGHT = 20;
const PAGE_BOTTOM = 780;

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const localidad = request.nextUrl.searchParams.get("localidad") ?? "";

  let query = supabaseAdmin
    .from("attendees")
    .select("nombre, apellido, localidad, telefono, fecha_nacimiento, created_at")
    .order("created_at", { ascending: false });
  if (localidad) query = query.eq("localidad", localidad);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []).map((a) => {
    const date = new Date(a.created_at);
    const [y, m, d] = a.fecha_nacimiento.split("-");
    return {
      nombre: a.nombre,
      apellido: a.apellido,
      localidad: a.localidad,
      telefono: a.telefono ?? "—",
      fechaNacimiento: `${d}/${m}/${y}`,
      fechaHora: `${date.toLocaleDateString("es-AR")} ${date.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
    };
  });

  const logoPath = path.join(process.cwd(), "public", "logosinfondo.png");

  const doc = new PDFDocument({ size: "A4", margin: 40 });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));
  const finished = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  function drawHeader() {
    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#ffffff");
    doc.image(logoPath, 40, 30, { width: 130 });
    doc
      .fillColor("#111827")
      .fontSize(18)
      .font("Helvetica-Bold")
      .text(`Inscriptos${localidad ? ` — ${localidad}` : ""}`, 190, 38);
    doc
      .fillColor("#6b7280")
      .fontSize(9)
      .font("Helvetica")
      .text(
        `Generado el ${new Date().toLocaleString("es-AR")}  ·  Total: ${rows.length}`,
        190,
        62
      );
  }

  function drawColumnHeaders(y: number) {
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#ffffff");
    doc.rect(40, y, 515, ROW_HEIGHT).fill("#27272a");
    doc.fillColor("#ffffff");
    for (const col of COLUMNS) {
      doc.text(col.label, col.x + 4, y + 6, { width: col.width - 8, ellipsis: true });
    }
  }

  drawHeader();
  drawColumnHeaders(TABLE_TOP);

  let y = TABLE_TOP + ROW_HEIGHT;
  doc.font("Helvetica").fontSize(9);

  rows.forEach((row, i) => {
    if (y + ROW_HEIGHT > PAGE_BOTTOM) {
      doc.addPage();
      drawHeader();
      drawColumnHeaders(TABLE_TOP);
      y = TABLE_TOP + ROW_HEIGHT;
    }

    if (i % 2 === 0) {
      doc.rect(40, y, 515, ROW_HEIGHT).fill("#f4f4f5");
    }
    doc.fillColor("#18181b");
    for (const col of COLUMNS) {
      doc.text(row[col.key], col.x + 4, y + 6, { width: col.width - 8, ellipsis: true });
    }
    y += ROW_HEIGHT;
  });

  if (rows.length === 0) {
    doc.fillColor("#71717a").text("No hay inscriptos para mostrar.", 40, y + 10);
  }

  doc.end();
  const buffer = await finished;

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="noche-plateada-inscriptos.pdf"',
    },
  });
}
