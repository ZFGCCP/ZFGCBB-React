import type { ReactNode } from "react";

export type FeaturedItem = {
  previewId?: number;
  title: string;
  author?: string;
  status?: string | null;
  rating?: number;
  voteCount?: number;
  summary?: string;
  contentHtml?: string | null;
  href: string;
  metaLine?: string;
};

export type RailItem = {
  previewId?: number;
  title: string;
  href: string;
  subtitle: ReactNode;
};

export type CarouselSlide = { key: string; content: ReactNode };
