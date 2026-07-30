interface BBDateProps {
  dateStr: string | null | undefined;
  fallback?: string;
  long?: boolean;
}

const locale =
  typeof navigator === "undefined" ? undefined : navigator.language;

const dateTimeFormatter = new Intl.DateTimeFormat(locale, {
  dateStyle: "short",
  timeStyle: "medium",
});

const dateFormatter = new Intl.DateTimeFormat(locale, {
  dateStyle: "short",
});

const longDateTimeFormatter = new Intl.DateTimeFormat(locale, {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
});

const longDateFormatter = new Intl.DateTimeFormat(locale, {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const TIME_PART_TYPES = new Set(["hour", "minute", "second", "dayPeriod"]);

function formatLongDateTime(epochMilliseconds: number): string {
  const parts = longDateTimeFormatter.formatToParts(epochMilliseconds);
  const firstTimePartIndex = parts.findIndex((part) =>
    TIME_PART_TYPES.has(part.type),
  );
  return parts
    .map((part, index) =>
      part.type === "literal" && index === firstTimePartIndex - 1
        ? ", "
        : part.value,
    )
    .join("");
}

export default function BBDate({
  dateStr,
  fallback = "—",
  long = false,
}: BBDateProps) {
  const parsed = parseWireDate(dateStr);
  let formatted = fallback;
  if (parsed) {
    const epochMilliseconds = wireDateEpochMilliseconds(parsed);
    if (parsed.kind === "datetime")
      formatted = long
        ? formatLongDateTime(epochMilliseconds)
        : dateTimeFormatter.format(epochMilliseconds);
    else
      formatted = (long ? longDateFormatter : dateFormatter).format(
        epochMilliseconds,
      );
  }
  return (
    <time
      dateTime={parsed ? parsed.value.toString() : undefined}
      suppressHydrationWarning
    >
      {formatted}
    </time>
  );
}
