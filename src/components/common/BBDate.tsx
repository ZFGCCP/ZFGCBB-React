interface BBDateProps {
  dateStr: string | null | undefined;
  fallback?: string;
}

type Parsed =
  | { kind: "datetime"; value: Temporal.PlainDateTime }
  | { kind: "date"; value: Temporal.PlainDate };

function parse(dateStr: string): Parsed | null {
  try {
    return { kind: "datetime", value: Temporal.PlainDateTime.from(dateStr) };
  } catch {}
  try {
    return { kind: "date", value: Temporal.PlainDate.from(dateStr) };
  } catch {}
  return null;
}

const locale =
  typeof navigator !== "undefined" ? navigator.language : undefined;

const dateTimeOptions: Intl.DateTimeFormatOptions = {
  dateStyle: "short",
  timeStyle: "medium",
};

const dateOptions: Intl.DateTimeFormatOptions = { dateStyle: "short" };

export default function BBDate({ dateStr, fallback = "—" }: BBDateProps) {
  const parsed = dateStr ? parse(dateStr) : null;
  const formatted = !parsed?.value
    ? fallback
    : parsed.kind === "datetime"
      ? parsed.value.toLocaleString(locale, dateTimeOptions)
      : parsed.value.toLocaleString(locale, dateOptions);
  return (
    <time
      dateTime={parsed ? parsed.value.toString() : undefined}
      suppressHydrationWarning
    >
      {formatted}
    </time>
  );
}
