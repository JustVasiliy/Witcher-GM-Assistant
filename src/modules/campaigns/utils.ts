export function formatRelativeTime(date: Date): string {
  const diffMs = date.getTime() - Date.now();
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const divisions: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
    { amount: 60, unit: "seconds" },
    { amount: 60, unit: "minutes" },
    { amount: 24, unit: "hours" },
    { amount: 7, unit: "days" },
    { amount: 4.34524, unit: "weeks" },
    { amount: 12, unit: "months" },
    { amount: Number.POSITIVE_INFINITY, unit: "years" },
  ];

  let duration = diffMs / 1000;
  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }
  return rtf.format(Math.round(duration), "years");
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

export function formatDateOnly(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
}
