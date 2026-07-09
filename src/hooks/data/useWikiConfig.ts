export function useWikiConfig() {
  return useBBQuery("/wiki/meta/config", {
    staleTime: 600000,
    gcTime: 900000,
    schema: WikiConfigSchema,
  });
}
