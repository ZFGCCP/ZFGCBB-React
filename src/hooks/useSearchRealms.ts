import type { SearchRealm } from "@/types/search";

export function useSearchRealms() {
  return useBBQuery<SearchRealm[]>("/search/realms", {
    staleTime: 600000,
    gcTime: 900000,
  });
}
