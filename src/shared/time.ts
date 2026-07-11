export type WireDate =
  | { kind: "datetime"; value: Temporal.PlainDateTime }
  | { kind: "date"; value: Temporal.PlainDate };

const localTimeZone = Temporal.Now.timeZoneId();

export function parseWireDate(
  dateStr: string | null | undefined,
): WireDate | null {
  if (!dateStr) {
    return null;
  }
  try {
    return {
      kind: "datetime",
      value: Temporal.Instant.from(dateStr)
        .toZonedDateTimeISO(localTimeZone)
        .toPlainDateTime(),
    };
  } catch {}
  try {
    return { kind: "datetime", value: Temporal.PlainDateTime.from(dateStr) };
  } catch {}
  try {
    return { kind: "date", value: Temporal.PlainDate.from(dateStr) };
  } catch {}
  return null;
}

export function wireYear(dateStr: string | null | undefined): number | null {
  return parseWireDate(dateStr)?.value.year ?? null;
}

export function wireDateEpochMilliseconds(wireDate: WireDate): number {
  return wireDate.value.toZonedDateTime(localTimeZone).epochMilliseconds;
}

export function currentEpochMilliseconds(): number {
  return Temporal.Now.instant().epochMilliseconds;
}
