import type { ContentFormat } from "@/types/content";

const CONTENT_FORMAT_LABELS: Record<ContentFormat, string> = {
  BBCODE: "BBCode",
  MARKDOWN: "Markdown",
};

export function contentFormatLabel(contentFormat: ContentFormat): string {
  return CONTENT_FORMAT_LABELS[contentFormat];
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
