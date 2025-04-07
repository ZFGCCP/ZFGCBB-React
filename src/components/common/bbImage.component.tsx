import type React from "react";
import {
  Suspense,
  type ElementType,
  type ComponentProps,
  useRef,
  useEffect,
  useState,
} from "react";
import Skeleton from "./skeleton.component";

type ImageModule = { default: string };

const images: Record<string, () => Promise<ImageModule>> =
  import.meta.glob<ImageModule>([
    `/src/assets/images/**/*`,
    `/src/assets/themes/**/*`,
  ]);

type CacheEntry = {
  status: "pending" | "success" | "error";
  result?: string;
  promise?: Promise<void>;
};

/**
 * A simple in-memory cache for image URLs.
 */
const imageCache = new Map<string, CacheEntry>();

const isValidUrl = (str: string): boolean => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

function preloadImage(path: string): CacheEntry {
  if (imageCache.has(path)) {
    return imageCache.get(path)!;
  }

  const cacheEntry: CacheEntry = { status: "pending" };
  imageCache.set(path, cacheEntry);

  // Skip actual preloading on server side
  if (typeof window === "undefined") {
    cacheEntry.status = "success";
    cacheEntry.result = path;
    return cacheEntry;
  }

  if (import.meta.env.DEV)
    console.debug(`<BBImage> Fetching image for ${path}`);

  // Handle URL-sourced images
  if (isValidUrl(path)) {
    cacheEntry.promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        cacheEntry.status = "success";
        cacheEntry.result = path;
        resolve();
      };
      img.onerror = () => {
        console.error(`Failed to load image URL: ${path}`);
        cacheEntry.status = "error";
        reject();
      };
    });
    return cacheEntry;
  }

  const imageLoader = images[`/src/assets/${path}`];

  if (!imageLoader) {
    if (import.meta.env.DEV) {
      console.warn(`Image not found: ${path}. Rendering nothing.`);
    }
    cacheEntry.status = "error";
    return cacheEntry;
  }

  cacheEntry.promise = imageLoader()
    .then((mod: ImageModule) => {
      cacheEntry.status = "success";
      cacheEntry.result = mod.default;
    })
    .catch((err: unknown) => {
      console.error(`Failed to load image: ${path}`, err);
      cacheEntry.status = "error";
    });

  return cacheEntry;
}
/**
 * This hook returns the path of the image file for a given path.
 * It handles caching and preloading of images. Handles hydration mismatch by
 * deferring client-side loading.
 * @param path - The path of the image file.
 * @returns The path of the image file.
 */
function useImage(path: string): string | undefined {
  const pathRef = useRef<string>(path);
  const [isClient, setIsClient] = useState(import.meta.env.SSR);
  pathRef.current = path;

  // Handle hydration mismatch by deferring client-side loading
  useEffect(() => {
    setIsClient(true);
  }, []);

  const cacheEntry = preloadImage(path);

  // On server or during hydration, return the path immediately
  if (!isClient) {
    return path;
  }

  if (cacheEntry.status === "pending") {
    throw cacheEntry.promise;
  } else if (cacheEntry.status === "error") {
    return undefined;
  } else {
    return cacheEntry.result;
  }
}

/**
 * This type represents the `src` prop of a component that uses the {@link BBImage} component.
 * @see {@link BBImage}
 * @see {@link BBImageProps}
 * @see {@link HTMLImageElement}
 */
type ComponentWithSrcProp = {
  src: ImagesPath | ThemesPath | `${string}://${string}/${string}`;
};

/**
 * This type represents the props of a component that uses the {@link BBImage} component.
 * It extends the {@link ComponentProps} type with the `src` prop. (i.e., {@link HTMLImageElement})
 * @see {@link ComponentWithSrcProp}
 */
type ReactComponentWithSrcProps<ComponentType extends ElementType> =
  "src" extends keyof ComponentProps<ComponentType>
    ? Omit<ComponentProps<ComponentType>, "src"> & ComponentWithSrcProp
    : never;

/**
 * This type represents the props of the {@link ImageLoader} component.
 * @param ComponentType - The component type to render.
 */
type ImageLoaderProps<ComponentType extends ElementType = "img"> = {
  src: ComponentWithSrcProp["src"];
  as?: ComponentType;
};

/**
 * This component is a wrapper around the {@link ImageLoader} component that handles the `src` prop.
 * @param src - The path of the image file.
 * @param as - The component type to render.
 * @param props - The props to pass to the component.
 * @returns The rendered component.
 * @see {@link ImageLoaderProps}
 */
function ImageLoader<ComponentType extends ElementType = "img">({
  src,
  as,
  ...props
}: ImageLoaderProps<ComponentType>): React.ReactElement | null {
  const imageSrc = useImage(src);
  const Component = as || "img";

  return typeof imageSrc === "string" && imageSrc.length > 0 ? (
    <Component {...props} src={imageSrc} />
  ) : null;
}

/**
 * This type represents the props of the {@link BBImage} component.
 * @param ComponentType - The component type to render.
 * @extends ReactComponentWithSrcProps - Extends the {@link ReactComponentWithSrcProps} type to add the `fallback` and `as` props.
 */
export type BBImageProps<ComponentType extends ElementType = "img"> =
  ReactComponentWithSrcProps<ComponentType> & {
    fallback?: React.ReactNode;
    as?: ComponentType;
  };

/**
 * This component is a wrapper around the <img> tag that preloads the image
 * before rendering it. It supports both URL-sourced images and dynamic imports.
 * It also provides a fallback component to render while loading or if the
 * image fails to load. The component is SSR-compatible and handles hydration
 * correctly.
 *
 * Usage:
 * ```tsx
 * // With dynamic import
 * <BBImage src="folder/image.png" alt="Description" />
 *
 * // With URL
 * <BBImage src="https://example.com/image.jpg" alt="Description" />
 * ```
 * @param rest - The {@link BBImageProps} to pass to the {@link BBImage} component.
 * @returns The rendered component.
 * @see {@link BBImageProps}
 */
export default function BBImage<ComponentType extends ElementType = "img">({
  fallback,
  ...rest
}: BBImageProps<ComponentType>): React.ReactElement {
  if (import.meta.env.DEV && !("alt" in rest)) {
    console.warn(
      "BBImage component for",
      rest.src,
      "is missing an alt prop. This will cause a11y issue.",
    );
  }

  const MyAss =
    typeof window === "undefined" ? null : (fallback ?? <Skeleton />);

  return (
    <Suspense fallback={MyAss}>
      <ImageLoader {...rest} />
    </Suspense>
  );
}
