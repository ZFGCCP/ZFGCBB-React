import type { WikiPageRef } from "@/types/content";
import type { TrailSegment } from "@/components/wiki/WikiShell";

export function wikiRefPath(ref: WikiPageRef) {
  return `/wiki/${ref.slug}`;
}

export function specialTrail(name: string): TrailSegment[] {
  return [{ label: "SPECIAL" }, { label: name.toUpperCase() }];
}
