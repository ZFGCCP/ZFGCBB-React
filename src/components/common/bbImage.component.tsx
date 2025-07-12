import type React from "react";
import { Suspense, lazy } from "react";
import Skeleton from "./skeleton.component";

/**
 * This type represents the `src` prop of a component that uses the {@link BBImage} component.
 * @see {@link BBImage}
 */
type ComponentWithSrcProp = {
  src: string | `${string}://${string}/${string}`;
};

/**
 * This type represents the props of a component that uses the {@link BBImage} component.
 * It extends the {@link ComponentProps} type with the `src` prop. (i.e., {@link HTMLImageElement})
 */
type ReactComponentWithSrcProps<ComponentType extends React.ElementType> =
  "src" extends keyof React.ComponentProps<ComponentType>
    ? Omit<React.ComponentProps<ComponentType>, "src"> & ComponentWithSrcProp
    : never;

/**
 * This type represents the props of the {@link BBImage} component.
 * @param ComponentType - The component type to render.
 */
export type BBImageProps<ComponentType extends React.ElementType = "img"> =
  ReactComponentWithSrcProps<ComponentType> & {
    fallback?: React.ReactNode;
    as?: ComponentType;
  };

type BBImageComponentType<ComponentType extends React.ElementType = "img"> =
  React.LazyExoticComponent<
    React.FC<Omit<BBImageProps<ComponentType>, "src" | "as" | "fallback">>
  >;
const lazyImageComponentCache = new Map<string, BBImageComponentType>();

type ImageModule = { default: string };
const images: Record<string, () => Promise<ImageModule>> =
  import.meta.glob<ImageModule>([
    `/src/assets/images/**/*`,
    `/src/assets/themes/**/*`,
  ]);

/**
 * Resolves a path or URL into a usable image source.
 * @param path - Relative path or full URL to the image.
 * @returns A resolved image path or undefined if not found.
 */
async function preloadImage(path: string): Promise<string | undefined> {
  if (URL.canParse(path)) return path;

  const loader = images[`/src/assets/${path}`];
  if (!loader) {
    if (import.meta.env.DEV)
      console.warn(`Image not found: ${path}. Rendering nothing.`);
    return undefined;
  }

  return (await loader()).default;
}

/**
 * Lazily creates a component that renders the resolved image.
 * This uses React.lazy to defer image resolution and component rendering until needed.
 *
 * @param src - The image path or URL to preload.
 * @param as - The component type to render (e.g., "img").
 */
function lazyImageLoader<ComponentType extends React.ElementType = "img">(
  src: string,
  as?: ComponentType,
): BBImageComponentType<ComponentType> {
  const key = `${src}::${as ?? "img"}`;
  type ImageComponentProps = Omit<
    BBImageProps<ComponentType>,
    "src" | "as" | "fallback"
  >;

  if (lazyImageComponentCache.has(key))
    return lazyImageComponentCache.get(key)!;

  const lazyComponent = lazy(async () => {
    const resolvedSrc = await preloadImage(src);
    const Component = as || "img";
    const ImageComponent = (componentProps: ImageComponentProps) => {
      const props: ImageComponentProps = Object.assign(
        {
          decoding: "async",
          loading: "lazy",
          fetchPriority: "high",
          crossOrigin: "anonymous",
        },
        componentProps,
      );

      return !resolvedSrc ? null : (
        <>
          <link
            rel="preload"
            href={resolvedSrc}
            crossOrigin="anonymous"
            as="image"
          />
          <Component {...props} src={resolvedSrc} />
        </>
      );
    };
    return { default: ImageComponent };
  });

  lazyImageComponentCache.set(key, lazyComponent as BBImageComponentType);
  return lazyComponent;
}

/**
 * The main exported BBImage component.
 * Dynamically resolves images via `preloadImage` and renders them through a lazily loaded component.
 * Supports SSR-safe rendering, URL-based images, and Vite glob imports.
 *
 * Example usage:
 * ```tsx
 * <BBImage src="images/logo.png" alt="Logo" />
 * <BBImage src="https://example.com/banner.jpg" alt="Banner" />
 * ```
 *
 * @param src - The image path or URL to load.
 * @param fallback - Optional fallback to render during loading.
 * @param as - Optional component type to render (defaults to `<img>`).
 * @param rest - Other props passed to the rendered component.
 */
export default function BBImage<
  ComponentType extends React.ElementType = "img",
>({
  src,
  fallback,
  as,
  ...rest
}: BBImageProps<ComponentType>): React.ReactElement {
  if (import.meta.env.DEV && !("alt" in rest))
    console.warn(
      `BBImage component for ${src} is missing an alt prop. This will cause a11y issue.`,
    );
  const LazyImage = lazyImageLoader(src, as);
  const MyAss = fallback ?? <Skeleton />;

  return (
    <Suspense fallback={MyAss}>
      <LazyImage key={`${src}::${as ?? "img"}`} {...rest} />
    </Suspense>
  );
}

if (import.meta.hot)
  import.meta.hot.dispose(() => {
    lazyImageComponentCache.clear();
  });
