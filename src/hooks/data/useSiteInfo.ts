export const useSiteInfo = () => {
  return useBBQuery("/system/site", {
    schema: SiteInfoSchema,
    staleTime: 1000 * 60 * 60,
  });
};
