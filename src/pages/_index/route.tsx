import { entityRoute } from "@/shared/http/entityLoaders";

const HOME_URL = `/wiki/${encodeWikiPath("Site:Home")}` as `/${string}`;

const route = entityRoute({
  dehydrated: true,
  url: () => HOME_URL,
  schema: WikiPageSchema,
});

export const loader = route.loader;
export const clientLoader = route.clientLoader;

export default function Home() {
  const query = useBBQuery(HOME_URL, { schema: WikiPageSchema });
  return (
    <BBQueryBoundary query={query}>
      {(page) => (
        <BBHtml
          html={page.contentParsed ?? ""}
          className="whitespace-pre-wrap [&_.bb-widget]:bg-muted [&_.bb-widget]:shadow-panel"
        />
      )}
    </BBQueryBoundary>
  );
}

export function meta() {
  return [{ title: "Home" }];
}
