export const useInstallStatus = () => {
  return useBBQuery("/system/install/status", {
    retry: 0,
    gcTime: 0,
    staleTime: 0,
    schema: InstallStatusResponseSchema,
  });
};
