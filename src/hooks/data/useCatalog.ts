import type { GenericSchema } from "valibot";
import type { CatalogQuery } from "@/components/common/BBCatalogToolbar";

export type CatalogParamMap = {
  filter: string;
  language?: string;
};

export function catalogListUrl(
  basePath: `/${string}`,
  paramMap: CatalogParamMap,
  params: URLSearchParams,
): `/${string}` {
  const files = params.get("files");
  const query = toQuery({
    search: params.get("q"),
    [paramMap.filter]: params.get(paramMap.filter),
    language: paramMap.language ? params.get(paramMap.language) : null,
    author: params.get("author"),
    hasDownload: files === "yes" ? "true" : files === "no" ? "false" : null,
    sort: params.get("sort"),
    page: parsePage(params.get("page")),
    pageSize: 12,
  });
  return `${basePath}?${query.toString()}`;
}

export function useCatalog<TItem>(
  basePath: `/${string}`,
  paramMap: CatalogParamMap,
  itemSchema: GenericSchema<unknown, TItem>,
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = useBBQuery(catalogListUrl(basePath, paramMap, searchParams), {
    schema: pagedSchema(itemSchema),
  });
  const data = query.data;

  const apply = (next: CatalogQuery & { page?: number }) => {
    setSearchParams(
      (params) =>
        mergeParams(
          params,
          {
            q: next.search,
            author: next.author,
            [paramMap.filter]: next.filter,
            ...(paramMap.language
              ? { [paramMap.language]: next.language }
              : {}),
            files: next.availability,
            sort: next.sort,
            page: next.page ?? 1,
          },
          { page: "1" },
        ),
      { replace: true, preventScrollReset: next.page === undefined },
    );
  };

  const totalPages = data
    ? Math.max(1, Math.ceil(data.total / data.pageSize))
    : 1;

  return { searchParams, data, query, apply, totalPages };
}
