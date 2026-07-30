import { useForm } from "@tanstack/react-form";
import * as v from "valibot";

const ContentFormSchema = v.object({
  body: v.pipe(
    v.string(),
    v.nonEmpty("Content cannot be empty."),
    v.maxLength(100000, "Content is too long."),
  ),
  summary: v.pipe(v.string(), v.maxLength(255, "Summary is too long.")),
});

export type ContentEditorValue = v.InferOutput<typeof ContentFormSchema>;
type Bbcode = v.InferOutput<typeof BbcodeListSchema>[number];

const TOOLBAR_PRIORITY = [
  "b",
  "i",
  "u",
  "s",
  "url",
  "img",
  "quote",
  "code",
  "spoiler",
  "list",
  "li",
  "size",
  "color",
  "youtube",
];

interface BBContentEditorProps {
  initialBody?: string;
  rows?: number;
  submitLabel: string;
  pendingLabel: string;
  errorMessage?: string | null;
  showSummary?: boolean;
  previewScope?: "WIKI" | "FORUM";
  onSubmit: (value: ContentEditorValue) => Promise<unknown>;
}

function ToolbarButton({
  entry,
  onInsert,
}: {
  entry: Bbcode;
  onInsert: (code: string, selfClosing: boolean) => void;
}) {
  const insert = useCallback(
    () => onInsert(entry.code, entry.selfClosing),
    [entry.code, entry.selfClosing, onInsert],
  );

  return (
    <button
      type="button"
      title={`[${entry.code}]`}
      onClick={insert}
      className="px-2 py-0.5 text-xs bg-muted border border-default hover:bg-elevated"
    >
      {entry.code}
    </button>
  );
}

export default function BBContentEditor({
  initialBody,
  rows = 15,
  submitLabel,
  pendingLabel,
  errorMessage,
  showSummary = false,
  previewScope = "FORUM",
  onSubmit,
}: BBContentEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState(false);

  const bbcodesQuery = useBBQuery("/content/bbcodes", {
    schema: BbcodeListSchema,
  });
  const toolbar = useMemo(() => {
    const codes = bbcodesQuery.data ?? [];
    const prioritySet = new Set(TOOLBAR_PRIORITY);
    const byCode = new Map<string, Bbcode>();
    const rest: Bbcode[] = [];
    for (const entry of codes) {
      if (prioritySet.has(entry.code)) byCode.set(entry.code, entry);
      else rest.push(entry);
    }
    const prioritized: Bbcode[] = [];
    for (const code of TOOLBAR_PRIORITY) {
      const entry = byCode.get(code);
      if (entry) prioritized.push(entry);
    }
    return [...prioritized, ...rest];
  }, [bbcodesQuery.data]);

  const form = useForm({
    defaultValues: {
      body: initialBody ?? "",
      summary: "",
    },
    validators: {
      onBlur: ContentFormSchema,
      onSubmit: ContentFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  const insertTag = useCallback(
    (code: string, selfClosing: boolean) => {
      const textarea = containerRef.current?.querySelector<HTMLTextAreaElement>(
        'textarea[name="body"]',
      );
      if (!textarea) return;
      const open = `[${code}]`;
      const close = selfClosing ? "" : `[/${code}]`;
      const start = textarea.selectionStart ?? textarea.value.length;
      const end = textarea.selectionEnd ?? start;
      const value = textarea.value;
      form.setFieldValue(
        "body",
        value.slice(0, start) +
          open +
          value.slice(start, end) +
          close +
          value.slice(end),
      );
      requestAnimationFrame(() => {
        textarea.focus();
        const cursor = selfClosing
          ? start + open.length
          : start + open.length + (end - start);
        textarea.setSelectionRange(cursor, cursor);
      });
    },
    [form],
  );

  const showPreview = useCallback(async () => {
    setMode("preview");
    setPreviewHtml(null);
    setPreviewError(false);
    try {
      const response = await apiFetch(`${getApiBaseUrl()}/content/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: form.getFieldValue("body"),
          scope: previewScope,
        }),
      });
      const data = await handleResponseWithJason(response, WikiPreviewSchema);
      setPreviewHtml(data.contentParsed);
    } catch {
      setPreviewError(true);
    }
  }, [form, previewScope]);
  const showWriteMode = useCallback(() => setMode("write"), []);
  const showPreviewMode = useCallback(() => {
    void showPreview();
  }, [showPreview]);

  return (
    <div ref={containerRef}>
      <BBForm form={form} className="space-y-4" errorMessage={errorMessage}>
        <div className="flex border-b-2 border-default">
          <button
            type="button"
            aria-current={mode === "write" ? "page" : undefined}
            onClick={showWriteMode}
            className={`cursor-pointer px-3 py-1 text-xs ${
              mode === "write"
                ? "border-2 border-b-0 border-default bg-accented font-bold text-highlighted"
                : "text-dimmed hover:text-highlighted"
            }`}
          >
            Write
          </button>
          <button
            type="button"
            aria-current={mode === "preview" ? "page" : undefined}
            onClick={showPreviewMode}
            className={`cursor-pointer px-3 py-1 text-xs ${
              mode === "preview"
                ? "border-2 border-b-0 border-default bg-accented font-bold text-highlighted"
                : "text-dimmed hover:text-highlighted"
            }`}
          >
            Preview
          </button>
        </div>

        {mode === "write" ? (
          <>
            <div className="flex flex-wrap gap-1">
              {toolbar.map((entry) => (
                <ToolbarButton
                  key={entry.code}
                  entry={entry}
                  onInsert={insertTag}
                />
              ))}
            </div>
            <BBTextareaField name="body" rows={rows} />
          </>
        ) : (
          <div className="border-2 border-default bg-accented p-3 min-h-32">
            {previewError ? (
              <BBErrorInline message="Preview failed. Are you logged in?" />
            ) : previewHtml == null ? (
              <span className="text-dimmed">Rendering preview…</span>
            ) : (
              <BBHtml html={previewHtml} className="whitespace-pre-wrap" />
            )}
          </div>
        )}

        {showSummary && (
          <BBField
            name="summary"
            label="Edit summary"
            placeholder="Describe your change"
          />
        )}
        <BBSubmit
          pendingChildren={pendingLabel}
          className="px-4 py-2 bg-accented border border-default hover:bg-elevated disabled:opacity-50"
        >
          {submitLabel}
        </BBSubmit>
      </BBForm>
    </div>
  );
}
