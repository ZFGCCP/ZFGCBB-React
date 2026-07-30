import type { Project } from "./ProjectMasthead";

export function ProjectDownloadRow({
  download,
}: {
  download: Project["downloads"][number];
}) {
  return (
    <li>
      <BBDownloadLink
        contentResourceId={download.contentResourceId!}
        filename={download.filename}
        className="text-highlighted"
      >
        {download.label ?? download.filename ?? "Download"}
      </BBDownloadLink>
      {download.label && download.filename && (
        <span className="text-xs text-dimmed"> ({download.filename})</span>
      )}
      <span className="text-xs text-dimmed">
        {download.fileSize !== null &&
          download.fileSize !== undefined &&
          download.fileSize > 0 && <> · {formatFileSize(download.fileSize)}</>}
        {download.publishedTs && (
          <>
            {" · "}
            <BBDate dateStr={download.publishedTs} />
          </>
        )}
      </span>
      {download.filename?.toLowerCase().endsWith(".zip") && (
        <BBArchiveContents
          contentResourceId={download.contentResourceId!}
          filename={download.filename}
        />
      )}
    </li>
  );
}

export function ProjectDownloads({
  downloads,
}: {
  downloads: Project["downloads"];
}) {
  return (
    <ul className="space-y-2 text-sm">
      {downloads.map((download) => (
        <ProjectDownloadRow
          key={download.contentResourceId}
          download={download}
        />
      ))}
    </ul>
  );
}
