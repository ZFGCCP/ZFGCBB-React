interface BBDownloadLinkProps {
  contentResourceId: number;
  filename?: string | null | undefined;
  icon?: boolean | undefined;
  className?: string | undefined;
  children?: React.ReactNode | undefined;
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
