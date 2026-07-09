import { useSearchParams } from "react-router";
import { useBBQuery } from "@/hooks/useBBQuery";
import type { Paged } from "@/types/content";
import type { CatalogQuery } from "@/components/common/BBCatalogToolbar";

export type CatalogParamMap = {
  filter: string;
  language?: string;
};

function filterKeys(paramMap: CatalogParamMap) {
  return [
    "q",
    "author",
    paramMap.filter,
    ...(paramMap.language ? [paramMap.language] : []),
    "files",
    "sort",
  ];
}

export function catalogListUrl(
  basePath: `/${string}`,
  paramMap: CatalogParamMap,
  params: URLSearchParams,
): `/${string}` {
  const query = new URLSearchParams();
  if (params.get("q")) query.set("search", params.get("q")!);
  if (params.get(paramMap.filter))
    query.set(paramMap.filter, params.get(paramMap.filter)!);
  if (paramMap.language && params.get(paramMap.language))
    query.set("language", params.get(paramMap.language)!);
  if (params.get("author")) query.set("author", params.get("author")!);
  if (params.get("files") === "yes") query.set("hasDownload", "true");
  if (params.get("files") === "no") query.set("hasDownload", "false");
  if (params.get("sort")) query.set("sort", params.get("sort")!);
  query.set("page", params.get("page") ?? "1");
  query.set("pageSize", "12");
  return `${basePath}?${query.toString()}`;
}

export function useCatalog<TItem>(
  basePath: `/${string}`,
  paramMap: CatalogParamMap,
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data } = useBBQuery<Paged<TItem>>(
    catalogListUrl(basePath, paramMap, searchParams),
  );

  const apply = (next: CatalogQuery & { page?: number }) => {
    setSearchParams(
      (params) => {
        const merged = new URLSearchParams(params);
        if (next.search !== undefined) merged.set("q", next.search);
        if (next.author !== undefined) merged.set("author", next.author);
        if (next.filter !== undefined) merged.set(paramMap.filter, next.filter);
        if (paramMap.language && next.language !== undefined)
          merged.set(paramMap.language, next.language);
        if (next.availability !== undefined)
          merged.set("files", next.availability);
        if (next.sort !== undefined) merged.set("sort", next.sort);
        merged.set("page", String(next.page ?? 1));
        for (const key of filterKeys(paramMap))
          if (!merged.get(key)) merged.delete(key);
        if (merged.get("page") === "1") merged.delete("page");
        return merged;
      },
      { replace: true, preventScrollReset: next.page === undefined },
    );
  };

  const totalPages = data
    ? Math.max(1, Math.ceil(data.total / data.pageSize))
    : 1;

  return { searchParams, data, apply, totalPages };
}
