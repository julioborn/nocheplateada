const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - i);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export type FechaNacimiento = { dia: string; mes: string; anio: string };

export function isFechaNacimientoCompleta(f: FechaNacimiento) {
  if (!f.dia || !f.mes || !f.anio) return false;
  const date = new Date(Number(f.anio), Number(f.mes) - 1, Number(f.dia));
  return (
    date.getFullYear() === Number(f.anio) &&
    date.getMonth() === Number(f.mes) - 1 &&
    date.getDate() === Number(f.dia)
  );
}

export function fechaNacimientoToISO(f: FechaNacimiento) {
  return `${f.anio}-${f.mes.padStart(2, "0")}-${f.dia.padStart(2, "0")}`;
}

export default function FechaNacimientoField({
  value,
  onChange,
  invalid,
}: {
  value: FechaNacimiento;
  onChange: (v: FechaNacimiento) => void;
  invalid?: boolean;
}) {
  const selectClass = `rounded-lg border bg-black/60 px-3 py-2.5 text-zinc-100 outline-none transition focus:ring-1 ${
    invalid
      ? "border-red-500 focus:border-red-400 focus:ring-red-400"
      : "border-zinc-700 focus:border-zinc-300 focus:ring-zinc-300"
  }`;

  return (
    <div className="flex flex-col gap-1.5 text-left">
      <span className="text-xs uppercase tracking-widest text-zinc-400">
        Fecha de nacimiento
      </span>
      <div className="grid grid-cols-3 gap-2">
        <select
          required
          value={value.dia}
          onChange={(e) => onChange({ ...value, dia: e.target.value })}
          className={selectClass}
        >
          <option value="">Día</option>
          {DAYS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          required
          value={value.mes}
          onChange={(e) => onChange({ ...value, mes: e.target.value })}
          className={selectClass}
        >
          <option value="">Mes</option>
          {MESES.map((m, i) => (
            <option key={m} value={i + 1}>
              {m}
            </option>
          ))}
        </select>
        <select
          required
          value={value.anio}
          onChange={(e) => onChange({ ...value, anio: e.target.value })}
          className={selectClass}
        >
          <option value="">Año</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      {invalid && (
        <span className="text-xs text-red-400">Ingresá una fecha de nacimiento válida</span>
      )}
    </div>
  );
}
