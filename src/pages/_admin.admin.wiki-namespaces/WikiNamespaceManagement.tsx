import * as v from "valibot";
import type { WikiImportNamespace } from "@/schemas/system";
import { WikiNamespaceRow } from "./WikiNamespaceRow";

const NAMESPACE_EMPTY_STATE = (
  <BBEmpty message="No import namespaces are configured." />
);
const isNamespaceListEmpty = (namespaces: WikiImportNamespace[]) =>
  namespaces.length === 0;

export function WikiNamespaceManagement() {
  const namespacesQuery = useBBQuery("/system/wiki/import-namespaces", {
    schema: WikiImportNamespaceListSchema,
    queryKey: "admin-wiki-import-namespaces",
  });

  const saveNamespace = useBBMutation({
    schema: v.unknown(),
    request: (variables: { sourceNamespaceId: number; name: string }) => ({
      url: `/system/wiki/import-namespaces/${String(variables.sourceNamespaceId)}`,
      method: "PUT",
      body: { namespaceName: variables.name },
    }),
    invalidateKeys: [["admin-wiki-import-namespaces"]],
  });

  const handleSave = useCallback(
    (sourceNamespaceId: number, name: string) => {
      saveNamespace.mutate({ sourceNamespaceId, name });
    },
    [saveNamespace],
  );

  const renderNamespaces = useCallback(
    (namespaces: WikiImportNamespace[]) => (
      <div>
        <p className="p-2 text-sm text-dimmed border-b-2 border-default">
          Maps a source MediaWiki namespace id to the name it takes in this
          wiki. Ids 0&ndash;15 are MediaWiki&apos;s standard namespaces; add
          your own for anything declared in <code>$wgExtraNamespaces</code>.
          Changes apply to the next migration &mdash; renaming a namespace that
          already holds pages is rejected.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {namespaces.map((namespace) => (
            <WikiNamespaceRow
              key={namespace.sourceNamespaceId}
              namespace={namespace}
              pending={saveNamespace.isPending}
              onSave={handleSave}
            />
          ))}
        </div>
        {saveNamespace.isError && (
          <p className="p-2 text-xs text-error">
            {saveNamespace.error?.message}
          </p>
        )}
      </div>
    ),
    [
      handleSave,
      saveNamespace.error?.message,
      saveNamespace.isError,
      saveNamespace.isPending,
    ],
  );

  return (
    <BBWidget widgetTitle="Wiki Import Namespaces">
      <BBQueryBoundary
        query={namespacesQuery}
        isEmpty={isNamespaceListEmpty}
        empty={NAMESPACE_EMPTY_STATE}
      >
        {renderNamespaces}
      </BBQueryBoundary>
    </BBWidget>
  );
}
