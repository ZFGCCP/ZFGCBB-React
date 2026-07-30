import * as v from "valibot";
import type { BbCodeToggle } from "@/schemas/forum";
import { BbCodeRow } from "./BbCodeRow";

const BBCODE_EMPTY_STATE = <BBEmpty message="No bbcodes found." />;
const isBbCodeListEmpty = (bbCodes: BbCodeToggle[]) => bbCodes.length === 0;

export function BbCodeManagement() {
  const bbCodesQuery = useBBQuery("/system/bbcodes", {
    schema: BbCodeToggleListSchema,
    queryKey: "admin-bbcodes",
  });

  const toggleBbCode = useBBMutation({
    schema: v.undefined(),
    request: (variables: { code: string; enabled: boolean }) => ({
      url: `/system/bbcodes/${variables.code}`,
      method: "PUT",
      body: { enabled: variables.enabled },
    }),
    invalidateKeys: [["admin-bbcodes"]],
  });
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
        <p className="p-2 text-sm text-dimmed border-b-2 border-default">
          Disabled bbcodes render as literal text in posts and wiki pages.
          Changes take effect immediately.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {bbCodes.map((bbCode) => (
            <BbCodeRow
              key={bbCode.code}
              bbCode={bbCode}
              pending={toggleBbCode.isPending}
              onToggle={handleToggle}
            />
          ))}
        </div>
        {toggleBbCode.isError && (
          <p className="p-2 text-xs text-error">
            {toggleBbCode.error?.message}
          </p>
        )}
      </div>
    ),
    [
      handleToggle,
      toggleBbCode.error?.message,
      toggleBbCode.isError,
      toggleBbCode.isPending,
    ],
  );

  return (
    <BBWidget widgetTitle="BBCode Management">
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
