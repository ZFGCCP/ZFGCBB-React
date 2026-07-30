import { Navigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { TrailSegment } from "./WikiShell";
import { UserContext } from "@/providers/user/userProvider";
import type { WikiRevisionRef } from "@/types/content";

const TOC_INDENT = ["", "pl-3", "pl-6", "pl-9", "pl-12", "pl-15"];

type WikiView = "article" | "source" | "history" | "edit";

const WIKI_MODERATOR_CODES = new Set([
  "ZFGC_WIKI_MODERATOR",
  "ZFGC_SITE_ADMIN",
]);
const WIKI_HISTORY_EMPTY_STATE = (
  <BBEmpty message="No revisions recorded for this page yet." />
);
const isWikiHistoryEmpty = (revisions: WikiRevisionRef[]) =>
  revisions.length === 0;

function WikiEditor({
  page,
  slug,
  isModerator,
  onPublished,
}: {
  page: WikiPage;
  slug: string;
  isModerator: boolean;
  onPublished: () => void;
}) {
  const queryClient = useQueryClient();
  const [queued, setQueued] = useState(false);

  const submitRevision = useBBMutation({
    schema: WikiRevisionSubmitSchema,
    request: (value: { body: string; summary: string }) => ({
      url: "/wiki/meta/revisions",
      method: "POST",
      body: {
        slug,
        content: value.body,
        summary: value.summary || undefined,
      },
    }),
    onSuccess: async (ref) => {
      if (
        isModerator &&
        ref.revisionId !== null &&
        ref.revisionId !== undefined
      ) {
        const response = await apiFetch(
          `${getApiBaseUrl()}/wiki/meta/moderation/${ref.revisionId}/approve`,
          { method: "POST" },
        );
        if (response.ok) {
          await queryClient.invalidateQueries({
            predicate: (query) =>
              typeof query.queryKey[0] === "string" &&
              query.queryKey[0].startsWith("/wiki/"),
          });
          onPublished();
          return;
        }
      }
      setQueued(true);
    },
  });
  const handleSubmit = useCallback(
    (value: { body: string; summary: string }) =>
      submitRevision.mutateAsync(value),
    [submitRevision],
  );

  if (queued) {
    return (
      <BBPanel className="p-4">
        Your edit was submitted and is waiting for a wiki moderator to review
        it.
      </BBPanel>
    );
  }

  return (
    <BBContentEditor
      initialBody={page.content ?? ""}
      showSummary
      previewScope="WIKI"
      previewSlug={page.slug}
      submitLabel="Save changes"
      pendingLabel="Saving..."
      errorMessage={
        submitRevision.isError ? "Failed to save the revision." : null
      }
      onSubmit={handleSubmit}
    />
  );
}

function WikiSource({ page }: { page: WikiPage }) {
  const [copied, setCopied] = useState(false);
  const resetCopied = useDebouncedCallback(() => {
    setCopied(false);
  }, 1500);
  const source = page.content ?? "";
  const lines = source ? source.split("\n").length : 0;
  const handleCopy = useCallback(() => {
    void (async () => {
      try {
        await navigator.clipboard.writeText(source);
        setCopied(true);
        resetCopied();
      } catch {
        setCopied(false);
      }
    })();
  }, [resetCopied, source]);

  return (
    <div className="space-y-2">
      <BBPanel className="flex flex-wrap items-center gap-x-4 gap-y-1 px-3 py-2 text-xs text-dimmed">
        <span>
          namespace{" "}
          <span className="text-default">{page.namespace || "MAIN"}</span>
        </span>
        <span>
          slug <span className="font-mono text-default">{page.slug}</span>
        </span>
        <span className="border border-default bg-accented px-1.5 py-0.5 font-bold tracking-widest text-highlighted">
          {page.contentFormat ?? "BBCODE"}
        </span>
        <span>
          {lines.toLocaleString()} lines · {source.length.toLocaleString()}{" "}
          chars
        </span>
        <BBButton size="xs" className="ml-auto" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </BBButton>
      </BBPanel>
      <BBPanel
        as="pre"
        className="max-h-[70vh] overflow-auto p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words"
      >
        {source || "(this page has no source content)"}
      </BBPanel>
    </div>
  );
}

function WikiHistory({ slug }: { slug: string }) {
  const query = useBBQuery(
    `/wiki/meta/history?slug=${encodeURIComponent(slug)}`,
    { schema: WikiRevisionRefListSchema },
  );

  const renderHistory = useCallback(
    (revisions: WikiRevisionRef[]) => (
      <WikiHistoryResults revisions={revisions} slug={slug} />
    ),
    [slug],
  );

  return (
    <BBQueryBoundary
      query={query}
      isEmpty={isWikiHistoryEmpty}
      empty={WIKI_HISTORY_EMPTY_STATE}
    >
      {renderHistory}
    </BBQueryBoundary>
  );
}

function WikiHistoryResults({
  revisions,
  slug,
}: {
  revisions: WikiRevisionRef[];
  slug: string;
}) {
  return (
    <section aria-label="Revision history">
      <p className="mb-3 text-xs tracking-widest text-dimmed">
        {revisions.length.toLocaleString()} REVISION
        {revisions.length === 1 ? "" : "S"}, NEWEST FIRST
      </p>
      <WikiTimeline>
        {revisions.map((revision, index) => {
          const older = revisions[index + 1];
          const delta = older ? revision.size - older.size : null;
          return (
            <WikiTimelineItem
              key={revision.revisionId}
              summary={revision.summary}
            >
              <BBLink
                to={
                  revision.current
                    ? `/wiki/${slug}`
                    : `/wiki/${slug}?rev=${revision.revisionId}`
                }
                className="font-bold text-highlighted"
              >
                <BBDate dateStr={revision.authoredTs} fallback="unknown date" />
              </BBLink>
              {revision.current && (
                <span className="border border-default bg-accented px-1.5 py-0.5 text-[10px] font-bold tracking-widest text-highlighted">
                  CURRENT
                </span>
              )}
              {revision.authorName && <span>{revision.authorName}</span>}
              <span className="text-xs text-dimmed">
                {revision.size.toLocaleString()} bytes
              </span>
              {delta !== null && delta !== 0 && (
                <span
                  className={`text-xs font-bold ${delta > 0 ? "text-highlighted" : "text-error"}`}
                >
                  {delta > 0 ? "+" : ""}
                  {delta.toLocaleString()}
                </span>
              )}
            </WikiTimelineItem>
          );
        })}
      </WikiTimeline>
    </section>
  );
}

const CATEGORY_MEMBERS_PER_PAGE = 50;

function CategoryMembers({ members }: { members: WikiPageRef[] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const totalPages = Math.max(
    1,
    Math.ceil(members.length / CATEGORY_MEMBERS_PER_PAGE),
  );
  const pageNo = Math.min(
    Math.max(Number(searchParams.get("page") ?? "1") || 1, 1),
    totalPages,
  );
  const visible = useMemo(
    () =>
      members.slice(
        (pageNo - 1) * CATEGORY_MEMBERS_PER_PAGE,
        pageNo * CATEGORY_MEMBERS_PER_PAGE,
      ),
    [members, pageNo],
  );
  const handlePageChange = useCallback(
    (next: number) => {
      setSearchParams(
        (params) =>
          mergeParams(params, {
            page: next <= 1 ? "" : String(next),
          }),
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return (
    <section aria-label="Pages in this category" className="mt-4 clear-both">
      <h2 className="border-b-2 border-default pb-1 text-xs font-bold tracking-widest">
        PAGES IN THIS CATEGORY ({members.length})
      </h2>
      {members.length === 0 ? (
        <p className="mt-2 text-sm text-dimmed">This category is empty.</p>
      ) : (
        <>
          <WikiPageList refs={visible} className="mt-2" />
          {totalPages > 1 && (
            <div className="mt-3">
              <BBPaginator
                numPages={totalPages}
                currentPage={pageNo}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}

function WikiFile({ file }: { file: WikiFileRef }) {
  const isImage = !!file.mimeType?.startsWith("image/");
  const isZip =
    file.mimeType === "application/zip" ||
    !!file.filename?.toLowerCase().endsWith(".zip");
  const galleryImages = useMemo(
    () => [
      {
        contentResourceId: file.contentResourceId,
        caption: file.filename,
      },
    ],
    [file.contentResourceId, file.filename],
  );
  return (
    <div className="mb-4 border-2 border-default bg-accented p-3">
      {isImage ? (
        <BBGallery images={galleryImages} />
      ) : isZip ? (
        <BBArchiveContents
          contentResourceId={file.contentResourceId}
          filename={file.filename}
        />
      ) : (
        <p className="text-sm text-dimmed">
          This is a binary file and cannot be previewed.
        </p>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 border-t-2 border-default pt-2 text-xs text-dimmed">
        <BBDownloadLink
          contentResourceId={file.contentResourceId}
          filename={file.filename}
          className="font-bold text-highlighted"
        >
          Download original
        </BBDownloadLink>
        {file.filename && <span className="text-default">{file.filename}</span>}
        {file.mimeType && <span>{file.mimeType}</span>}
        {file.fileSize !== null && file.fileSize !== undefined && (
          <span>{formatFileSize(file.fileSize)}</span>
        )}
      </div>
    </div>
  );
}

const BASE_WIKI_VIEWS: ReadonlyArray<readonly [WikiView, string]> = [
  ["article", "Article"],
  ["source", "View source"],
  ["history", "History"],
];

function WikiViewButton({
  viewKey,
  label,
  currentView,
  onViewChange,
}: {
  viewKey: WikiView;
  label: string;
  currentView: WikiView;
  onViewChange: (view: WikiView) => void;
}) {
  const handleClick = useCallback(() => {
    onViewChange(viewKey);
  }, [onViewChange, viewKey]);

  return (
    <button
      type="button"
      aria-current={currentView === viewKey ? "page" : undefined}
      onClick={handleClick}
      className={`cursor-pointer px-3 py-1 text-xs ${
        currentView === viewKey
          ? "-mb-[3px] border-2 border-b-0 border-default bg-accented pb-[7px] font-bold text-highlighted"
          : "text-dimmed hover:text-highlighted"
      }`}
    >
      {label}
    </button>
  );
}

function WikiPageView({
  page,
  slug,
  view,
  revisionId,
  noRedirect,
  isModerator,
  onViewChange,
}: {
  page: WikiPage;
  slug: string;
  view: WikiView;
  revisionId: string | null;
  noRedirect: boolean;
  isModerator: boolean;
  onViewChange: (view: WikiView) => void;
}) {
  const headings = page.headings ?? [];
  const showToc = page.toc ?? false;
  const entityHref = page.entityUrl ?? null;
  const oldRevision =
    page.revision && !page.revision.current ? page.revision : null;
  const canEdit = page.editable ?? false;
  const trail = useMemo<TrailSegment[]>(() => {
    const segments: TrailSegment[] = [];
    if (page.namespace === "Category") {
      segments.push({
        label: "CATEGORIES",
        to: "/wiki/special/categories",
      });
    } else if (
      page.namespace &&
      page.namespace !== "MAIN" &&
      page.namespace !== "ZFGCpedia" &&
      page.namespace !== "ZFGC"
    ) {
      segments.push({
        label: page.namespace.toUpperCase(),
        to: `/wiki/special/allpages?ns=${page.namespace}`,
      });
    }
    segments.push({ label: page.title.toUpperCase() });
    return segments;
  }, [page.namespace, page.title]);
  const entityLink = useMemo(
    () =>
      entityHref ? (
        <BBLink
          to={entityHref}
          className="ml-auto tracking-widest text-highlighted"
        >
          VIEW {page.namespace.toUpperCase()} PAGE{" "}
          <Fa6SolidArrowRight aria-hidden className="inline" />
        </BBLink>
      ) : undefined,
    [entityHref, page.namespace],
  );
  const reactableIds = useMemo(() => [page.id], [page.id]);
  const handlePublished = useCallback(() => {
    onViewChange("article");
  }, [onViewChange]);

  if (page.redirectTo && view === "article" && !revisionId && !noRedirect) {
    const base = page.redirectTo.startsWith("/")
      ? page.redirectTo
      : `/wiki/${encodeWikiPath(page.redirectTo)}`;
    if (base !== `/wiki/${encodeWikiPath(slug)}` && !base.includes("?")) {
      return <Navigate to={`${base}?redirect=no`} replace />;
    }
  }

  return (
    <div>
      <header>
        <WikiTrail segments={trail} right={entityLink} />
        <h1 className="mt-1 font-serif text-3xl tracking-tight text-highlighted md:text-4xl">
          {page.title}
        </h1>
        <div className="mt-2 flex flex-wrap items-end justify-end gap-x-4 border-b-[3px] border-double border-default">
          <nav aria-label="Page views" className="flex">
            {BASE_WIKI_VIEWS.map(([viewKey, label]) => (
              <WikiViewButton
                key={viewKey}
                viewKey={viewKey}
                label={label}
                currentView={view}
                onViewChange={onViewChange}
              />
            ))}
            {canEdit && (
              <WikiViewButton
                viewKey="edit"
                label="Edit"
                currentView={view}
                onViewChange={onViewChange}
              />
            )}
          </nav>
        </div>
      </header>

      <div className="pt-4">
        {view === "source" && <WikiSource page={page} />}
        {view === "history" && <WikiHistory slug={slug} />}
        {view === "edit" &&
          (canEdit ? (
            <WikiEditor
              page={page}
              slug={slug}
              isModerator={isModerator}
              onPublished={handlePublished}
            />
          ) : (
            <BBPanel className="p-4">
              You need to be logged in
              {page.namespace === "ZFGC" ? " as a wiki moderator" : ""} to edit
              this page.
            </BBPanel>
          ))}
        {view === "article" && (
          <>
            {oldRevision && (
              <aside className="mb-4 border-2 border-default bg-accented px-3 py-2 text-sm">
                You are viewing an old revision of this page, saved
                {oldRevision.authorName && (
                  <>
                    {" "}
                    by <b>{oldRevision.authorName}</b>
                  </>
                )}{" "}
                on{" "}
                <BBDate
                  dateStr={oldRevision.authoredTs}
                  fallback="unknown date"
                />
                . It may differ significantly from the{" "}
                <BBLink
                  to={`/wiki/${slug}`}
                  className="font-bold text-highlighted"
                >
                  current revision
                </BBLink>
                .
              </aside>
            )}
            {page.redirectTo && (
              <p className="text-sm text-dimmed">
                Redirects to{" "}
                <BBLink
                  to={
                    page.redirectTo.startsWith("/")
                      ? page.redirectTo
                      : `/wiki/${page.redirectTo}`
                  }
                  className="text-highlighted"
                >
                  {page.redirectTo.replaceAll("_", " ")}
                </BBLink>
              </p>
            )}
            {page.file && <WikiFile file={page.file} />}
            {showToc && (
              <nav
                aria-label="Contents"
                className="mb-4 inline-block border-2 border-dashed border-muted bg-muted/60 p-3 text-sm md:float-right md:ml-6 md:max-w-xs"
              >
                <p className="mb-1 text-xs font-bold tracking-widest">
                  CONTENTS
                </p>
                <ol className="space-y-0.5">
                  {headings.map((heading, index) => (
                    <li
                      key={heading.id}
                      className={
                        TOC_INDENT[Math.min(Math.max(heading.level - 1, 0), 5)]
                      }
                    >
                      <span className="text-dimmed">{index + 1}.</span>{" "}
                      <a href={`#${heading.id}`} className="text-highlighted">
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            {page.contentParsed && (
              <BBHtml
                html={page.contentParsed}
                className="whitespace-pre-wrap"
              />
            )}
            {page.namespace === "Category" && (
              <CategoryMembers members={page.categoryMembers} />
            )}
            {page.categories.length > 0 && (
              <footer className="clear-both mt-6 border-t-2 border-dotted border-default pt-2 text-xs text-dimmed">
                Categories:{" "}
                {page.categories.map((category, index) => (
                  <span key={category}>
                    {index > 0 && " · "}
                    <BBLink
                      to={`/wiki/Category:${category.replaceAll(" ", "_")}`}
                      className="text-highlighted"
                    >
                      {category}
                    </BBLink>
                  </span>
                ))}
              </footer>
            )}
            {!oldRevision && (
              <ReactionsProvider
                reactableType="WIKI_PAGE"
                reactableIds={reactableIds}
              >
                <ReactionBar
                  reactableId={page.id}
                  className="mt-6 border-t-2 border-default pt-3"
                />
              </ReactionsProvider>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function WikiContent({ slug }: { slug: string }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useContext(UserContext);
  const isModerator = Boolean(
    user.permissions?.some((permission) =>
      WIKI_MODERATOR_CODES.has(permission.permissionCode),
    ),
  );
  const action = searchParams.get("action");
  const view: WikiView =
    action === "source" || action === "history" || action === "edit"
      ? action
      : "article";
  const revisionId = searchParams.get("rev");
  const noRedirect = searchParams.get("redirect") === "no";
  const needsSource = view === "source" || view === "edit";
  const queryParams = new URLSearchParams();
  if (revisionId) queryParams.set("rev", revisionId);
  if (needsSource) queryParams.set("source", "true");
  const queryString = queryParams.toString();
  const query = useBBQuery(
    `/wiki/${encodeWikiPath(slug)}${queryString ? `?${queryString}` : ""}`,
    { schema: WikiPageSchema },
  );
  const setView = useCallback(
    (next: WikiView) => {
      setSearchParams(
        (params) =>
          mergeParams(params, { action: next === "article" ? "" : next }),
        { replace: true },
      );
    },
    [setSearchParams],
  );
  const renderPage = useCallback(
    (page: WikiPage) => (
      <WikiPageView
        page={page}
        slug={slug}
        view={view}
        revisionId={revisionId}
        noRedirect={noRedirect}
        isModerator={isModerator}
        onViewChange={setView}
      />
    ),
    [isModerator, noRedirect, revisionId, setView, slug, view],
  );

  return <BBQueryBoundary query={query}>{renderPage}</BBQueryBoundary>;
}
