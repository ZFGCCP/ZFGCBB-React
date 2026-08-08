import {
  clearExpectedSession,
  clearPrivateQueryState,
} from "@/providers/query/queryProvider";
import type { Route } from "./+types/route";

export async function clientLoader(_: Route.ClientLoaderArgs) {
  await logoutRequest();
  clearExpectedSession();
  await clearPrivateQueryState();
}

export default function UserLogout() {
  return (
    <BBWidget widgetTitle="Logout">
      <div className="p-4 space-y-2">
        <p>You have been successfully logged out.</p>
        <BBLink to="/">Return to home</BBLink>
      </div>
    </BBWidget>
  );
}
