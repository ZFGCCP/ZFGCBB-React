import { useField, useForm } from "@tanstack/react-form";
import * as v from "valibot";
import { useBBFormContext } from "./BBForm";
import type { ContentConversion, ContentFormat } from "@/types/content";

const ContentFormSchema = v.object({
  body: v.pipe(
    v.string(),
    v.nonEmpty("Content cannot be empty."),
    v.maxLength(100000, "Content is too long."),
  ),
  summary: v.pipe(v.string(), v.maxLength(255, "Summary is too long.")),
});

export type ContentEditorValue = v.InferOutput<typeof ContentFormSchema> & {
  contentFormat: ContentFormat;
};
type Bbcode = v.InferOutput<typeof BbcodeListSchema>[number];

type ContentConversionState = ContentConversion & {
  previousBody: string;
  previousContentFormat: ContentFormat;
};

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
  initialBody?: string | undefined;
  initialContentFormat?: ContentFormat | undefined;
  rows?: number | undefined;
  submitLabel: string;
  pendingLabel: string;
  errorMessage?: string | null | undefined;
  showSummary?: boolean | undefined;
  previewScope?: "WIKI" | "FORUM" | undefined;
  previewSlug?: string | undefined;
  onSubmit: (value: ContentEditorValue) => Promise<unknown>;
}

function ToolbarButton({
  entry,
  onInsert,
}: {
  entry: Bbcode;
  onInsert: (code: string, selfClosing: boolean) => void;
}) {
  const insert = useCallback(() => {
    onInsert(entry.code, entry.selfClosing);
  }, [entry.code, entry.selfClosing, onInsert]);

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

function ContentFormatButton({
  contentFormat,
  selected,
  disabled,
  onSelect,
}: {
  contentFormat: ContentFormat;
  selected: boolean;
  disabled: boolean;
  onSelect: (contentFormat: ContentFormat) => void;
}) {
  const select = useCallback(() => {
    onSelect(contentFormat);
  }, [contentFormat, onSelect]);

  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={select}
      className={`cursor-pointer border px-2 py-0.5 text-xs disabled:cursor-progress disabled:opacity-50 ${
        selected
          ? "border-default bg-accented font-bold text-highlighted"
          : "border-muted text-dimmed hover:text-highlighted"
      }`}
    >
      {contentFormatLabel(contentFormat)}
    </button>
  );
}

function ContentConversionNotice({
  conversion,
  contentFormat,
  onUndo,
}: {
  conversion: ContentConversionState;
  contentFormat: ContentFormat;
  onUndo: () => void;
}) {
  const form = useBBFormContext();
  const bodyField = useField({ form, name: "body" });
  if (String(bodyField.state.value ?? "") !== conversion.content) return null;

  const hasNotes = conversion.notes.length > 0;
  return (
    <output
      className={`block space-y-2 border-2 p-3 text-sm ${
        hasNotes ? "border-error bg-accented" : "border-default bg-muted"
      }`}
    >
      <div className="flex items-start gap-3">
        <p className={hasNotes ? "font-bold text-error" : "text-dimmed"}>
          {hasNotes
            ? `Converted to ${contentFormatLabel(contentFormat)}, but some markup did not survive:`
            : `Converted to ${contentFormatLabel(contentFormat)}.`}
        </p>
        <button
          type="button"
          onClick={onUndo}
          className="ml-auto shrink-0 cursor-pointer border border-default bg-muted px-2 py-0.5 text-xs hover:bg-elevated"
        >
          Undo conversion
        </button>
      </div>
      {hasNotes && (
        <ul className="list-disc space-y-1 pl-5 text-error">
          {conversion.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}
    </output>
  );
}

export default function BBContentEditor({
  initialBody,
  initialContentFormat,
  rows = 15,
  submitLabel,
  pendingLabel,
  errorMessage,
  showSummary = false,
  previewScope = "FORUM",
  previewSlug,
  onSubmit,
}: BBContentEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const conversionInFlightRef = useRef(false);
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState(false);
  const [chosenContentFormat, setChosenContentFormat] =
    useState<ContentFormat | null>(null);
  const [conversion, setConversion] = useState<ContentConversionState | null>(
    null,
  );
  const [conversionFailure, setConversionFailure] = useState<string | null>(
    null,
  );

  const { data: siteInfo } = useSiteInfo();
  const contentFormat =
    chosenContentFormat ??
    initialContentFormat ??
    siteInfo?.defaultContentFormat ??
    "BBCODE";
  const contentFormatOptions =
    siteInfo?.contentFormats ?? ContentFormatSchema.options;

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
      await onSubmit({ ...value, contentFormat });
    },
  });

  const convertContent = useBBMutation({
    schema: ContentConversionSchema,
    request: (variables: {
      content: string;
      fromContentFormat: ContentFormat;
      toContentFormat: ContentFormat;
    }) => ({
      url: "/content/convert",
      body: { ...variables, scope: previewScope },
    }),
  });

  const selectContentFormat = useCallback(
    (nextContentFormat: ContentFormat) => {
      if (nextContentFormat === contentFormat || conversionInFlightRef.current)
        return;
      setConversion(null);
      setConversionFailure(null);
      const bodyBeforeConversion = form.getFieldValue("body");
      if (bodyBeforeConversion.trim().length === 0) {
        setChosenContentFormat(nextContentFormat);
        return;
      }
      conversionInFlightRef.current = true;
      convertContent.mutate(
        {
          content: bodyBeforeConversion,
          fromContentFormat: contentFormat,
          toContentFormat: nextContentFormat,
        },
        {
          onSuccess: (converted) => {
            form.setFieldValue("body", converted.content);
            setChosenContentFormat(nextContentFormat);
            setConversion({
              ...converted,
              previousBody: bodyBeforeConversion,
              previousContentFormat: contentFormat,
            });
            setMode("write");
          },
          onError: () => {
            setConversionFailure(
              `Could not convert this ${contentFormatLabel(contentFormat)} to ${contentFormatLabel(nextContentFormat)}. Your text and its format are unchanged — try again in a moment.`,
            );
          },
          onSettled: () => {
            conversionInFlightRef.current = false;
          },
        },
      );
    },
    [contentFormat, convertContent, form],
  );

  const undoConversion = useCallback(() => {
    if (!conversion) return;
    form.setFieldValue("body", conversion.previousBody);
    setChosenContentFormat(conversion.previousContentFormat);
    setConversion(null);
    setConversionFailure(null);
  }, [conversion, form]);

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
          slug: previewSlug,
          contentFormat,
        }),
      });
      const data = await handleResponseWithJason(response, WikiPreviewSchema);
      setPreviewHtml(data.contentParsed);
    } catch {
      setPreviewError(true);
    }
  }, [contentFormat, form, previewScope, previewSlug]);
  const showWriteMode = useCallback(() => {
    setMode("write");
  }, []);
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
          <fieldset
            aria-label="Content format"
            className="ml-auto flex items-center gap-1 pb-1 self-end"
          >
            <span className="text-xs text-dimmed">
              {convertContent.isPending ? "Converting…" : "Format"}
            </span>
            {contentFormatOptions.map((option) => (
              <ContentFormatButton
                key={option}
                contentFormat={option}
                selected={option === contentFormat}
                disabled={convertContent.isPending}
                onSelect={selectContentFormat}
              />
            ))}
          </fieldset>
        </div>

        {conversionFailure && (
          <div
            role="alert"
            className="border-2 border-error bg-accented p-3 text-sm text-error"
          >
            {conversionFailure}
          </div>
        )}
        {conversion && (
          <ContentConversionNotice
            conversion={conversion}
            contentFormat={contentFormat}
            onUndo={undoConversion}
          />
        )}

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
            ) : previewHtml === null || previewHtml === undefined ? (
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
