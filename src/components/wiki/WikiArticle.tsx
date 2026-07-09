import { Navigate } from "react-router";
import type { TrailSegment } from "./WikiShell";

const TOC_INDENT = ["", "pl-3", "pl-6", "pl-9", "pl-12", "pl-15"];

type WikiView = "article" | "source" | "history";

function WikiSource({ page }: { page: WikiPage }) {
  const [copied, setCopied] = useState(false);
  const resetCopied = useDebouncedCallback(() => setCopied(false), 1500);
  const source = page.content ?? "";
  const lines = source ? source.split("\n").length : 0;

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
        <BBButton
          size="xs"
          className="ml-auto"
          onClick={() => {
            void navigator.clipboard.writeText(source).then(() => {
              setCopied(true);
              resetCopied();
            });
          }}
        >
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
  const { data: revisions } = useBBQuery<WikiRevisionRef[]>(
    `/wiki/meta/history?slug=${encodeURIComponent(slug)}`,
  );
  if (!revisions) return null;

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
                  className={`text-xs font-bold ${delta > 0 ? "text-green-500" : "text-red-500"}`}
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
  const visible = members.slice(
    (pageNo - 1) * CATEGORY_MEMBERS_PER_PAGE,
    pageNo * CATEGORY_MEMBERS_PER_PAGE,
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
                onPageChange={(next) => {
                  setSearchParams(
                    (params) => {
                      const merged = new URLSearchParams(params);
                      if (next <= 1) merged.delete("page");
                      else merged.set("page", String(next));
                      return merged;
                    },
                    { replace: true },
                  );
                }}
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
  return (
    <div className="mb-4 border-2 border-default bg-accented p-3">
      {isImage ? (
        <BBGallery
          images={[
            {
              contentResourceId: file.contentResourceId,
              caption: file.filename,
            },
          ]}
        />
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
        {file.fileSize != null && <span>{formatFileSize(file.fileSize)}</span>}
      </div>
    </div>
  );
}

export function WikiContent({ slug }: { slug: string }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const view: WikiView =
    searchParams.get("action") === "source"
      ? "source"
      : searchParams.get("action") === "history"
        ? "history"
        : "article";
  const revisionId = searchParams.get("rev");
  const noRedirect = searchParams.get("redirect") === "no";
  const { data: page } = useBBQuery<WikiPage>(
    `/wiki/${slug}${revisionId ? `?rev=${revisionId}` : ""}`,
  );

  if (!page) return null;

  if (page.redirectTo && view === "article" && !revisionId && !noRedirect) {
    const target = page.redirectTo.startsWith("/")
      ? page.redirectTo
      : `/wiki/${page.redirectTo}`;
    return <Navigate to={target as RoutePaths} replace />;
  }

  const setView = (next: WikiView) => {
    setSearchParams(
      (params) => {
        const merged = new URLSearchParams(params);
        if (next === "article") merged.delete("action");
        else merged.set("action", next);
        return merged;
      },
      { replace: true },
    );
  };

  const headings = page.headings ?? [];
  const showToc = page.toc ?? false;

  const entityHref = page.entityUrl ?? null;

  const oldRevision =
    page.revision && !page.revision.current ? page.revision : null;

  const trail: TrailSegment[] = [];
  if (page.namespace === "Category") {
    trail.push({ label: "CATEGORIES", to: "/wiki/special/categories" });
  } else if (
    page.namespace &&
    page.namespace !== "MAIN" &&
    page.namespace !== "ZFGCpedia"
  ) {
    trail.push({
      label: page.namespace.toUpperCase(),
      to: `/wiki/special/allpages?ns=${page.namespace}`,
    });
  }
  trail.push({ label: page.title.toUpperCase() });

  return (
    <div>
      <header>
        <WikiTrail
          segments={trail}
          right={
            entityHref && (
              <BBLink
                to={entityHref}
                className="ml-auto tracking-widest text-highlighted"
              >
                VIEW {page.namespace.toUpperCase()} PAGE{" "}
                <Fa6SolidArrowRight aria-hidden className="inline" />
              </BBLink>
            )
          }
        />
        <h1 className="mt-1 font-serif text-3xl tracking-tight text-highlighted md:text-4xl">
          {page.title}
        </h1>
        <div className="mt-2 flex flex-wrap items-end justify-end gap-x-4 border-b-[3px] border-double border-default">
          <nav aria-label="Page views" className="flex">
            {(
              [
                ["article", "Article"],
                ["source", "View source"],
                ["history", "History"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-current={view === key ? "page" : undefined}
                onClick={() => setView(key)}
                className={`cursor-pointer px-3 py-1 text-xs ${
                  view === key
                    ? "-mb-[3px] border-2 border-b-0 border-default bg-accented pb-[7px] font-bold text-highlighted"
                    : "text-dimmed hover:text-highlighted"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="pt-4">
        {view === "source" && <WikiSource page={page} />}
        {view === "history" && <WikiHistory slug={slug} />}
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
                    (page.redirectTo.startsWith("/")
                      ? page.redirectTo
                      : `/wiki/${page.redirectTo}`) as RoutePaths
                  }
                  className="text-highlighted"
                >
                  {page.redirectTo.replace(/_/g, " ")}
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
                      to={`/wiki/Category:${category.replace(/ /g, "_")}`}
                      className="text-highlighted"
                    >
                      {category}
                    </BBLink>
                  </span>
                ))}
              </footer>
            )}
          </>
        )}
      </div>
    </div>
  );
}
