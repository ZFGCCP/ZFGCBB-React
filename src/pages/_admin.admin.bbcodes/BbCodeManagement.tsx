import type { BbCodeToggle } from "@/schemas/forum";
import type { ContentScope } from "@/types/content";
import { BbCodeRow } from "./BbCodeRow";

const BBCODE_EMPTY_STATE = <BBEmpty message="No bbcodes found." />;
const isBbCodeListEmpty = (bbCodes: BbCodeToggle[]) => bbCodes.length === 0;

export function BbCodeManagement() {
  const bbCodesQuery = useBBQuery("/admin/bbcodes", {
    schema: BbCodeToggleListSchema,
    queryKey: "admin-bbcodes",
  });

  const toggleBbCode = useBBMutation({
    schema: BbCodeToggleSchema,
    request: (variables: { code: string; enabled: boolean }) => ({
      url: `/admin/bbcodes/${variables.code}`,
      method: "PUT",
      body: { enabled: variables.enabled },
    }),
    invalidateKeys: [["admin-bbcodes"]],
  });
  const toggleSurface = useBBMutation({
    schema: BbCodeToggleSchema,
    request: (variables: {
      code: string;
      surface: ContentScope;
      honoured: boolean;
    }) => ({
      url: `/admin/bbcodes/${variables.code}/surfaces`,
      method: "PUT",
      body: { surface: variables.surface, honoured: variables.honoured },
    }),
    invalidateKeys: [["admin-bbcodes"]],
  });
  const handleToggleSurface = useCallback(
    (bbCode: BbCodeToggle, surface: ContentScope, honoured: boolean) => {
      toggleSurface.mutate({ code: bbCode.code, surface, honoured });
    },
    [toggleSurface],
  );
  const handleToggle = useCallback(
    (bbCode: BbCodeToggle) => {
      toggleBbCode.mutate({
        code: bbCode.code,
        enabled: !bbCode.enabled,
      });
    },
    [toggleBbCode],
  );
  const renderBbCodes = useCallback(
    (bbCodes: BbCodeToggle[]) => (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {bbCodes.map((bbCode) => (
            <BbCodeRow
              key={bbCode.code}
              bbCode={bbCode}
              pending={toggleBbCode.isPending || toggleSurface.isPending}
              onToggle={handleToggle}
              onToggleSurface={handleToggleSurface}
            />
          ))}
        </div>
        {toggleBbCode.isError && (
          <p className="p-2 text-xs text-error">
            {toggleBbCode.error?.message}
          </p>
        )}
        {toggleSurface.isError && (
          <p className="p-2 text-xs text-error">
            {toggleSurface.error?.message}
          </p>
        )}
      </div>
    ),
    [
      handleToggle,
      handleToggleSurface,
      toggleBbCode.error?.message,
      toggleBbCode.isError,
      toggleBbCode.isPending,
      toggleSurface.error?.message,
      toggleSurface.isError,
      toggleSurface.isPending,
    ],
  );

  return (
    <BBWidget widgetTitle="BBCodes">
      <BBQueryBoundary
        query={bbCodesQuery}
        isEmpty={isBbCodeListEmpty}
        empty={BBCODE_EMPTY_STATE}
      >
        {renderBbCodes}
      </BBQueryBoundary>
    </BBWidget>
  );
}
