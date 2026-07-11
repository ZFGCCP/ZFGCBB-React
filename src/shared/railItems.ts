import type { ReactNode } from "react";
import type { RailItem } from "@/components/cms/showcase/showcaseTypes";

export function toRailItems<
  T extends {
    previewContentResourceId?: number;
    title: string;
    slug: string;
  },
>(
  entities: T[],
  basePath: string,
  subtitle: (entity: T) => ReactNode,
): RailItem[] {
  return entities.map((entity) => ({
    previewId: entity.previewContentResourceId,
    title: entity.title,
    href: `${basePath}/${entity.slug}`,
    subtitle: subtitle(entity),
  }));
}
