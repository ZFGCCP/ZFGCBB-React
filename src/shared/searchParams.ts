import * as v from "valibot";

type QueryEntries = Record<string, string | number | null | undefined>;

export function toQuery(entries: QueryEntries): URLSearchParams {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(entries)) {
    if (value === null || value === undefined || value === "") continue;
    query.set(key, String(value));
  }
  return query;
}

export function mergeParams(
  prev: URLSearchParams,
  updates: Record<string, string | number | undefined>,
  dropDefaults: Record<string, string> = {},
): URLSearchParams {
  const merged = new URLSearchParams(prev);
  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined) continue;
    merged.set(key, String(value));
  }
  for (const key of [...merged.keys()]) {
    if (!merged.get(key)) merged.delete(key);
  }
  for (const [key, value] of Object.entries(dropDefaults)) {
    if (merged.get(key) === value) merged.delete(key);
  }
  return merged;
}

const PageParam = v.fallback(
  v.pipe(
    v.unknown(),
    v.transform((value) => Number(value)),
    v.number(),
    v.integer(),
    v.minValue(1),
  ),
  1,
);

export function parsePage(raw: string | null): number {
  return v.parse(PageParam, raw);
}
