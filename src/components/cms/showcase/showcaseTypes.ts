import type { ReactNode } from "react";

export type FeaturedItem = {
  previewId?: number | undefined;
  title: string;
  author?: string | undefined;
  status?: string | null | undefined;
  rating?: number | undefined;
  voteCount?: number | undefined;
  summary?: string | undefined;
  contentHtml?: string | null | undefined;
  href: string;
  metaLine?: string | undefined;
};

export type RailItem = {
  previewId?: number | undefined;
  title: string;
  href: string;
  subtitle: ReactNode;
};

export type CarouselSlide = { key: string; content: ReactNode };
