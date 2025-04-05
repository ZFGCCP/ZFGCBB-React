import type React from "react";
import {
  Suspense,
  type ElementType,
  type ComponentProps,
  useRef,
  useEffect,
  useState,
} from "react";

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

  // const url =
  // path.startsWith("themes/")
  //   ? `/src/assets/themes/${path.replace("themes/", "")}`
  //   : `/src/assets/images/${path}`;
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

function useImage(path: string): string | undefined {
  const pathRef = useRef<string>(path);
  const [isClient, setIsClient] = useState(false);
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

type ImageLoaderProps<ComponentType extends ElementType = "img"> = {
  src: string;
  as?: ComponentType;
};

function ImageLoader<ComponentType extends ElementType = "img">({
  src,
  as,
  ...props
}: ImageLoaderProps<ComponentType>): React.ReactElement | null {
  const imageSrc = useImage(src);
  const Component = as || "img";

  return imageSrc ? <Component {...props} src={imageSrc} /> : null;
}

export type BBImageProps<ComponentType extends ElementType = "img"> = Omit<
  ComponentProps<ComponentType>,
  "src"
> & {
  fallback?: React.ReactNode;
  src: ImagesPath | ThemesPath | `${string}://${string}/${string}`;
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
 * <BBImage path="folder/image.png" alt="Description" />
 *
 * // With URL
 * <BBImage path="https://example.com/image.jpg" alt="Description" />
 * ```
 */
export default function BBImage<ComponentType extends ElementType = "img">(
  props: BBImageProps<ComponentType>,
): React.ReactElement {
  if (import.meta.env.DEV && !("alt" in props)) {
    console.warn(
      `BBImage component is missing an alt prop. This will cause a11y issues.`,
    );
  }

  // Use a simpler fallback during SSR to avoid hydration mismatches
  const fallback =
    typeof window === "undefined"
      ? null
      : (props.fallback ?? <div>Loading...</div>);

  return (
    <Suspense fallback={fallback}>
      <ImageLoader {...props} src={props.src} as={props.as} />
    </Suspense>
  );
}
