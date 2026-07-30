import type { ReactElement, ComponentType, JSX } from "react";

type ImageProps = JSX.IntrinsicElements["img"];
type AsComponent = ("img" | "image") | ComponentType<Partial<ImageProps>>;
type SrcPath =
  | ImagesPath
  | ThemesPath
  | `${string}://${string}/${string}`
  | `${string}/content/${number}`;

type BBImageBaseProps = Omit<ImageProps, "src"> & {
  fallback?: ReactElement;
  as?: AsComponent;
};

/**
 * This type represents the props of the {@link BBImage} component.
 */
export type BBImageProps = BBImageBaseProps &
  ({ src: SrcPath; dynamicSrc?: never } | { src?: never; dynamicSrc: string });

/**
 * Resolves a path or URL into a usable image source.
 * @param path - Relative path or full URL to the image.
 * @returns A resolved image path or undefined if not found.
 */
function resolveSrc(path: string): string | undefined {
  if (URL.canParse(path)) return path;
  if (path) return path.startsWith("/") ? path : `/${path}`;
  if (import.meta.env.DEV)
    console.warn(`Image not found: ${path}. Rendering nothing.`);
  return undefined;
}

/**
 * The main exported BBImage component.
 * Resolves the given src and renders an `<img>` (or a custom component via `as`)
 * with sensible defaults for `loading`, `decoding`, `fetchPriority`, and `crossOrigin`.
 *
 * Example usage:
 * ```tsx
 * <BBImage src="images/logo.png" alt="Logo" />
 * <BBImage src="https://example.com/banner.jpg" alt="Banner" />
 * ```
 *
 * @param src - The image path or URL to load.
 * @param fallback - Optional fallback to render when the path can't be resolved.
 * @param as - Optional component type to render (defaults to `<img>`).
 * @param rest - Other props passed to the rendered component.
 */
export default function BBImage(props: BBImageProps) {
  const { fallback, as: ass = "img" } = props;
  const source =
    typeof props.dynamicSrc === "string" ? props.dynamicSrc : props.src;
  const rest =
    typeof props.dynamicSrc === "string"
      ? (({ dynamicSrc: _, fallback: _fallback, as: _as, ...imageProps }) =>
          imageProps)(props)
      : (({ src: _, fallback: _fallback, as: _as, ...imageProps }) =>
          imageProps)(props);

  if (import.meta.env.DEV && !("alt" in rest))
    console.warn(
      `BBImage component for ${source} is missing an alt prop. This will cause a11y issue.`,
    );

  const resolvedSrc = resolveSrc(source);
  if (!resolvedSrc) return fallback ?? null;

  const componentProps: Partial<ImageProps> =
    ass === "img"
      ? {
          decoding: "async",
          loading: "lazy",
          fetchPriority: "high",
          crossOrigin: "anonymous",
          ...rest,
        }
      : rest;

  const Component = ass;
  return <Component {...(componentProps as object)} src={resolvedSrc} />;
}
