import type { FileAttachment } from "@/types/forum";

interface MessageAttachmentsProps {
  attachments: FileAttachment[];
  isEven: boolean;
}

export default function MessageAttachments({
  attachments,
  isEven,
}: MessageAttachmentsProps) {
  const images = useMemo(
    () =>
      attachments.filter((attachment) =>
        attachment.mimeType?.startsWith("image/"),
      ),
    [attachments],
  );
  const files = useMemo(
    () =>
      attachments.filter(
        (attachment) => !attachment.mimeType?.startsWith("image/"),
      ),
    [attachments],
  );
  const galleryImages = useMemo(
    () =>
      images.map((image) => ({
        contentResourceId: image.contentResourceId,
        caption: image.filename,
      })),
    [images],
  );

  if (attachments.length === 0) return null;

  return (
    <div className={`px-3 py-2 ${isEven ? "bg-elevated" : "bg-muted"}`}>
      <p className="text-xs text-dimmed mb-1">
        Attachments ({attachments.length})
      </p>

      {images.length > 0 && (
        <div className="mb-2">
          <BBGallery images={galleryImages} />
        </div>
      )}

      {files.length > 0 && (
        <div className="flex flex-col gap-1">
          {files.map((file) => (
            <BBDownloadLink
              key={file.contentResourceId}
              contentResourceId={file.contentResourceId}
              filename={file.filename ?? undefined}
              icon={false}
              className="text-sm text-highlighted hover:underline"
            >
              {file.filename ?? "attachment"} (
              {formatFileSize(file.fileSize ?? 0)})
            </BBDownloadLink>
          ))}
        </div>
      )}
    </div>
  );
}
