import { Navigate } from "react-router";

export default function RandomPage() {
  const [cacheBuster] = useState(() => Math.random().toString(36).slice(2));
  const { data } = useBBQuery("/wiki/meta/random", {
    schema: WikiPageRefSchema,
    queryKey: `wiki-random:${cacheBuster}`,
    gcTime: 0,
  });
  if (!data?.slug) return null;
  return <Navigate to={`/wiki/${data.slug}`} replace />;
}
