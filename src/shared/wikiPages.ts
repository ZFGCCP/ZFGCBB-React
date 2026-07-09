export function wikiPagesListUrl(params: URLSearchParams): `/${string}` {
  const query = toQuery({
    namespace: params.get("ns"),
    search: params.get("q"),
    page: parsePage(params.get("page")),
    pageSize: 50,
  });
  return `/wiki/meta/pages?${query.toString()}`;
}
