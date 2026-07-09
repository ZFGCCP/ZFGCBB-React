import { contentUrl } from "@/shared/http/api";

interface BBDownloadLinkProps {
  contentResourceId: number;
  filename?: string | null;
  icon?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function BBDownloadLink({
  contentResourceId,
  filename,
  icon = true,
  className,
  children,
}: BBDownloadLinkProps) {
  return (
    <a
      href={contentUrl(contentResourceId)}
      download={filename ?? undefined}
      className={icon ? `theme-chest ${className ?? ""}` : className}
    >
      {icon && (
        <>
          <BBIcon name="download" />{" "}
        </>
      )}
      {children}
    </a>
  );
}
