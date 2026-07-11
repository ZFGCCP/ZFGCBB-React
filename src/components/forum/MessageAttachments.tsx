import type { FileAttachment } from "@/types/forum";

interface MessageAttachmentsProps {
  attachments: FileAttachment[];
  isEven: boolean;
}

export default function MessageAttachments({
  attachments,
  isEven,
}: MessageAttachmentsProps) {
  if (!attachments || attachments.length === 0) return null;

  const images = attachments.filter((attachment) =>
    attachment.mimeType?.startsWith("image/"),
  );
  const files = attachments.filter(
    (attachment) => !attachment.mimeType?.startsWith("image/"),
  );

  return (
    <div className={`px-3 py-2 ${isEven ? "bg-elevated" : "bg-muted"}`}>
      <p className="text-xs text-dimmed mb-1">
        Attachments ({attachments.length})
      </p>

      {images.length > 0 && (
        <div className="mb-2">
          <BBGallery
            images={images.map((img) => ({
              contentResourceId: img.contentResourceId,
              caption: img.filename,
            }))}
          />
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
