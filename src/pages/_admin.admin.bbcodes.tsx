function BbCodeManagement() {
  const bbCodesQuery = useBBQuery("/system/bbcodes", {
    schema: BbCodeToggleListSchema,
    queryKey: "admin-bbcodes",
  });

  const toggleBbCode = useBBMutation({
    request: (variables: { code: string; enabled: boolean }) => ({
      url: `/system/bbcodes/${variables.code}`,
      method: "PUT",
      body: { enabled: variables.enabled },
    }),
    invalidateKeys: [["admin-bbcodes"]],
  });

  return (
    <BBWidget widgetTitle="BBCode Management">
      <BBQueryBoundary
        query={bbCodesQuery}
        isEmpty={(bbCodes) => bbCodes.length === 0}
        empty={<BBEmpty message="No bbcodes found." />}
      >
        {(bbCodes) => (
          <div>
            <p className="p-2 text-sm text-dimmed border-b-2 border-default">
              Disabled bbcodes render as literal text in posts and wiki pages.
              Changes take effect immediately.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2">
              {bbCodes.map((bbCode) => (
                <div
                  key={bbCode.code}
                  className="flex items-center gap-x-4 p-2 border-b border-default text-sm"
                >
                  <code className="w-32 font-mono text-highlighted">
                    [{bbCode.code}]
                  </code>
                  <span
                    className={`w-20 text-xs font-bold tracking-widest ${bbCode.enabled ? "text-highlighted" : "text-dimmed"}`}
                  >
                    {bbCode.enabled ? "ENABLED" : "DISABLED"}
                  </span>
                  <BBButton
                    size="xs"
                    disabled={toggleBbCode.isPending}
                    onClick={() =>
                      toggleBbCode.mutate({
                        code: bbCode.code,
                        enabled: !bbCode.enabled,
                      })
                    }
                  >
                    {bbCode.enabled ? "Disable" : "Enable"}
                  </BBButton>
                </div>
              ))}
            </div>
            {toggleBbCode.isError && (
              <p className="p-2 text-xs text-error">
                {(toggleBbCode.error as Error)?.message}
              </p>
            )}
          </div>
        )}
      </BBQueryBoundary>
    </BBWidget>
  );
}

export default function AdminBbCodesPage() {
  return (
    <BBHasPermission requiredPermissions={["ZFGC_SITE_ADMIN"]}>
      <BbCodeManagement />
    </BBHasPermission>
  );
}
