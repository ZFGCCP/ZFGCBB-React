import type { Project } from "./ProjectMasthead";

export function ProjectNews({ news }: { news: Project["news"] }) {
  return (
    <section aria-label="Project news" className="space-y-2">
      <h2 className="border-b-2 border-default pb-1 font-bold tracking-widest text-xs">
        NEWS
      </h2>
      {news.map((entry) => (
        <BBPanel
          as="article"
          key={`${entry.threadId}:${entry.publishedTs}:${entry.subject}`}
          className="p-2.5"
        >
          {entry.subject && <p className="font-bold">{entry.subject}</p>}
          <p className="text-xs text-dimmed">
            {entry.authorName && (
              <>
                by{" "}
                <UserLink userId={entry.authorUserId} name={entry.authorName} />
              </>
            )}
            {entry.publishedTs && (
              <>
                {" · "}
                <BBDate dateStr={entry.publishedTs} />
              </>
            )}
          </p>
          {entry.body && (
            <p className="mt-1 whitespace-pre-wrap">{entry.body}</p>
          )}
          {entry.threadId && (
            <BBLink
              to={`/forum/thread/${entry.threadId}/1`}
              className="text-xs text-highlighted"
            >
              {entry.threadName
                ? `Read "${entry.threadName}"`
                : "Read the news topic"}
              <Fa6SolidArrowRight aria-hidden className="ml-1 inline" />
            </BBLink>
          )}
        </BBPanel>
      ))}
    </section>
  );
}
