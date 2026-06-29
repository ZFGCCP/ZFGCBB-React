import type { FileAttachment } from "@/types/forum";
import { contentUrl } from "@/shared/http/api";
import { formatFileSize } from "@/shared/format";

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
    <div
      className={`border-t border-default px-3 py-2 ${isEven ? "bg-elevated" : "bg-muted"}`}
    >
      <p className="text-xs text-dimmed mb-1">
        Attachments ({attachments.length})
      </p>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {images.map((img) => (
            <a
              key={img.contentResourceId}
              href={contentUrl(img.contentResourceId)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={contentUrl(img.contentResourceId)}
                alt={img.filename}
                className="max-h-48 max-w-64 rounded border border-default object-contain"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="flex flex-col gap-1">
          {files.map((file) => (
            <a
              key={file.contentResourceId}
              href={contentUrl(file.contentResourceId)}
              className="text-sm text-highlighted hover:underline"
              download={file.filename}
            >
              {file.filename} ({formatFileSize(file.fileSize)})
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
