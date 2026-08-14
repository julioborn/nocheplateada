import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";
import ExcelJS from "exceljs";
import { isAdminAuthed } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

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

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Noche Plateada";
  const sheet = workbook.addWorksheet("Inscriptos");

  const logoBuffer = await readFile(
    path.join(process.cwd(), "public", "logosinfondo.png")
  );
  const imageId = workbook.addImage({ buffer: logoBuffer as never, extension: "png" });
  sheet.addImage(imageId, { tl: { col: 0, row: 0 }, ext: { width: 210, height: 118 } });
  sheet.getRow(1).height = 90;

  sheet.mergeCells("C1:E2");
  const titleCell = sheet.getCell("C1");
  titleCell.value = `Inscriptos${localidad ? ` — ${localidad}` : ""}`;
  titleCell.font = { size: 16, bold: true, color: { argb: "FF1F2937" } };
  titleCell.alignment = { vertical: "middle" };

  const genCell = sheet.getCell("F1");
  genCell.value = `Generado: ${new Date().toLocaleString("es-AR")}`;
  genCell.font = { size: 9, italic: true, color: { argb: "FF6B7280" } };

  const headerRowIndex = 4;
  const headerRow = sheet.getRow(headerRowIndex);
  headerRow.values = [
    "Nombre",
    "Apellido",
    "Localidad",
    "Teléfono",
    "Fecha nac.",
    "Fecha registro",
    "Hora",
  ];
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF27272A" },
    };
    cell.alignment = { vertical: "middle" };
  });

  sheet.columns = [
    { key: "nombre", width: 20 },
    { key: "apellido", width: 20 },
    { key: "localidad", width: 24 },
    { key: "telefono", width: 18 },
    { key: "fechaNacimiento", width: 14 },
    { key: "fecha", width: 14 },
    { key: "hora", width: 10 },
  ];

  (data ?? []).forEach((a) => {
    const date = new Date(a.created_at);
    const [y, m, d] = a.fecha_nacimiento.split("-");
    sheet.addRow({
      nombre: a.nombre,
      apellido: a.apellido,
      localidad: a.localidad,
      telefono: a.telefono ?? "",
      fechaNacimiento: `${d}/${m}/${y}`,
      fecha: date.toLocaleDateString("es-AR"),
      hora: date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
    });
  });

  sheet.getRow(3).height = 6;

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="noche-plateada-inscriptos.xlsx"',
    },
  });
}
