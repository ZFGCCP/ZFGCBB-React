import type { Route } from "./+types/route";

export function loader(_: Route.LoaderArgs) {
  return new Response('{"status":"ok"}', {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
