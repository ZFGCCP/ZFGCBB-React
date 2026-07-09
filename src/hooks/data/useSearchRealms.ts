export function useSearchRealms() {
  return useBBQuery("/search/realms", {
    staleTime: 600000,
    gcTime: 900000,
    schema: SearchRealmListSchema,
  });
}
