import type { Project } from "./ProjectMasthead";

export function ProjectSidebar({ project }: { project: Project }) {
  return (
    <aside aria-label="Project details">
      <BBPanel
        as="dl"
        className="text-xs [&_dt]:border-b [&_dt]:border-default/40 [&_dt]:bg-accented [&_dt]:px-2.5 [&_dt]:py-1 [&_dt]:font-bold [&_dt]:tracking-widest [&_dd]:border-b [&_dd]:border-default/40 [&_dd]:px-2.5 [&_dd]:py-1.5"
      >
        <dt>AUTHOR</dt>
        <dd>
          <UserLink
            userId={project.createdUserId}
            name={
              project.author ?? (project.createdUserId ? "profile" : "unknown")
            }
          />
        </dd>
        {project.team && (
          <>
            <dt>TEAM</dt>
            <dd>
              <span className="font-bold">{project.team.name}</span>
              {project.team.members.length > 0 && (
                <ul className="mt-1 list-none space-y-0.5">
                  {project.team.members.map((member) => (
                    <li key={member.userId}>
                      <UserLink
                        userId={member.userId}
                        name={member.displayName ?? `member #${member.userId}`}
                      />
                      {member.memberRole && (
                        <span className="text-dimmed">
                          {" "}
                          — {member.memberRole}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </dd>
          </>
        )}
        {project.publishedTs && (
          <>
            <dt>PUBLISHED</dt>
            <dd>
              <BBDate dateStr={project.publishedTs} />
            </dd>
          </>
        )}
        {project.lastUpdatedTs && (
          <>
            <dt>LAST UPDATED</dt>
            <dd>
              <BBDate dateStr={project.lastUpdatedTs} />
            </dd>
          </>
        )}
        {project.language && (
          <>
            <dt>LANGUAGE</dt>
            <dd>{project.language}</dd>
          </>
        )}
        {project.requirements && (
          <>
            <dt>REQUIREMENTS</dt>
            <dd>{project.requirements}</dd>
          </>
        )}
        {project.rating !== null &&
          project.rating !== undefined &&
          (project.voteCount ?? 0) > 0 && (
            <>
              <dt>RATING</dt>
              <dd
                aria-label={`Rated ${project.rating.toFixed(1)} out of 5 from ${project.voteCount} votes`}
              >
                <span aria-hidden className="inline-flex items-center gap-0.5">
                  {Array.from({ length: 5 }, (_, index) =>
                    index < Math.round(project.rating ?? 0) ? (
                      <Fa6SolidStar key={index} />
                    ) : (
                      <Fa6RegularStar key={index} />
                    ),
                  )}
                </span>{" "}
                {project.rating.toFixed(1)}{" "}
                <span className="text-dimmed">({project.voteCount} votes)</span>
              </dd>
            </>
          )}
        <dt>VIEWS</dt>
        <dd>{(project.viewCount ?? 0).toLocaleString()}</dd>
        {(project.downloadCount ?? 0) > 0 && (
          <>
            <dt>DOWNLOADS</dt>
            <dd>{project.downloadCount!.toLocaleString()}</dd>
          </>
        )}
        {project.tags.length > 0 && (
          <>
            <dt>TAGS</dt>
            <dd className="flex flex-wrap gap-1">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-default bg-accented px-1.5 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </dd>
          </>
        )}
      </BBPanel>
    </aside>
  );
}
