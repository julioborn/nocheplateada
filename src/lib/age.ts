type DateParts = { y: number; m: number; d: number };

function todayParts(): DateParts {
  const now = new Date();
  return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
}

function subtractYears({ y, m, d }: DateParts, years: number): DateParts {
  return { y: y - years, m, d };
}

function addDays({ y, m, d }: DateParts, days: number): DateParts {
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  return { y: date.getUTCFullYear(), m: date.getUTCMonth() + 1, d: date.getUTCDate() };
}

function partsToISO({ y, m, d }: DateParts) {
  return `${String(y).padStart(4, "0")}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function calcAge(fechaNacimientoISO: string): number {
  const [y, m, d] = fechaNacimientoISO.split("-").map(Number);
  const today = todayParts();
  let age = today.y - y;
  const hadBirthdayThisYear = today.m > m || (today.m === m && today.d >= d);
  if (!hadBirthdayThisYear) age--;
  return age;
}

/**
 * Converts an [minAge, maxAge] filter into an equivalent birth-date range,
 * since age itself isn't stored — only fecha_nacimiento is queryable.
 */
export function ageRangeToBirthDateRange(minAge?: number, maxAge?: number) {
  const today = todayParts();
  let maxBirthDate: string | undefined;
  let minBirthDate: string | undefined;

  if (minAge !== undefined && !Number.isNaN(minAge)) {
    maxBirthDate = partsToISO(subtractYears(today, minAge));
  }
  if (maxAge !== undefined && !Number.isNaN(maxAge)) {
    minBirthDate = partsToISO(addDays(subtractYears(today, maxAge + 1), 1));
  }

  return { minBirthDate, maxBirthDate };
}
