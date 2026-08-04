import * as v from "valibot";
import type { SiteAuthoringConfig } from "@/schemas/system";
import type { ContentFormat } from "@/types/content";

export const handle = {
  breadcrumb: "Content Authoring",
} satisfies BreadcrumbHandle;

const ADMIN_PERMISSION = ["ZFGC_SITE_ADMIN"] as const;

function AuthoringDefaultForm({ config }: { config: SiteAuthoringConfig }) {
  const [draft, setDraft] = useState<ContentFormat | null>(null);
  const selected = draft ?? config.defaultContentFormat;

  const saveDefaultContentFormat = useBBMutation({
    schema: SiteAuthoringConfigSchema,
    request: (defaultContentFormat: ContentFormat) => ({
      url: "/admin/site/authoring",
      method: "PUT",
      body: { defaultContentFormat },
    }),
    invalidateKeys: [["admin-site-authoring"], ["/system/site"]],
  });

  const options = useMemo(
    () =>
      config.contentFormats.map((contentFormat) => ({
        value: contentFormat,
        label: contentFormatLabel(contentFormat),
      })),
    [config.contentFormats],
  );
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const parsed = v.safeParse(ContentFormatSchema, event.target.value);
      if (parsed.success) setDraft(parsed.output);
    },
    [],
  );
  const handleSave = useCallback(() => {
    saveDefaultContentFormat.mutate(selected);
  }, [saveDefaultContentFormat, selected]);

  return (
    <div className="p-4 space-y-3">
      <p className="text-sm text-dimmed">
        New posts and wiki pages start in this format. Authors can switch on any
        individual post, and everything already written keeps the format it was
        written in.
      </p>
      <label
        htmlFor="defaultContentFormat"
        className="block text-sm font-medium text-muted"
      >
        Default format for new content
      </label>
      <BBSelect
        id="defaultContentFormat"
        name="defaultContentFormat"
        value={selected}
        onChange={handleChange}
        options={options}
      />
      <BBFlex gap="gap-3" align="center">
        <BBButton
          disabled={
            selected === config.defaultContentFormat ||
            saveDefaultContentFormat.isPending
          }
          onClick={handleSave}
        >
          {saveDefaultContentFormat.isPending ? "Saving..." : "Save"}
        </BBButton>
        {saveDefaultContentFormat.data && (
          <span className="text-sm text-dimmed">
            Saved. New content now defaults to{" "}
            {contentFormatLabel(
              saveDefaultContentFormat.data.defaultContentFormat,
            )}
            .
          </span>
        )}
        {saveDefaultContentFormat.isError && (
          <span className="text-sm text-error">
            {saveDefaultContentFormat.error?.message ??
              "Failed to save the authoring default."}
          </span>
        )}
      </BBFlex>
    </div>
  );
}

function AuthoringSettings() {
  const authoringQuery = useBBQuery("/admin/site/authoring", {
    schema: SiteAuthoringConfigSchema,
    queryKey: "admin-site-authoring",
  });
  const renderAuthoring = useCallback(
    (config: SiteAuthoringConfig) => <AuthoringDefaultForm config={config} />,
    [],
  );

  return (
    <BBWidget widgetTitle="Content Authoring">
      <BBQueryBoundary query={authoringQuery}>
        {renderAuthoring}
      </BBQueryBoundary>
    </BBWidget>
  );
}

export default function AdminAuthoringPage() {
  return (
    <BBHasPermission requiredPermissions={ADMIN_PERMISSION}>
      <AuthoringSettings />
    </BBHasPermission>
  );
}
