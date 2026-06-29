import type { WikiConfig } from "@/types/content";

export function useWikiConfig() {
  return useBBQuery<WikiConfig>("/wiki/meta/config", {
    staleTime: 600000,
    gcTime: 900000,
  });
}
