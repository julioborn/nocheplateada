export function formatDni(digits: string) {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 8);
}

export function isValidDni(digits: string) {
  return digits.length === 7 || digits.length === 8;
}

export default function DniField({
  value,
  onChange,
  invalid,
}: {
  value: string;
  onChange: (digits: string) => void;
  invalid?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-left">
      <span className="text-xs uppercase tracking-widest text-zinc-400">DNI</span>
      <input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        required
        value={formatDni(value)}
        onChange={(e) => onChange(onlyDigits(e.target.value))}
        placeholder="12.345.678"
        className={`rounded-lg border bg-black/60 px-4 py-2.5 text-zinc-100 outline-none transition focus:ring-1 ${
          invalid
            ? "border-red-500 focus:border-red-400 focus:ring-red-400"
            : "border-zinc-700 focus:border-zinc-300 focus:ring-zinc-300"
        }`}
      />
      {invalid && <span className="text-xs text-red-400">Ingresá un DNI válido (7 u 8 dígitos)</span>}
    </label>
  );
}
