import {
  clearExpectedSession,
  clearPrivateQueryState,
} from "@/providers/query/queryProvider";
import type { Route } from "./+types/route";

export async function clientLoader(_: Route.ClientLoaderArgs) {
  clearExpectedSession();
  await clearPrivateQueryState();
}

export default function AccountDeletedRoute() {
  return (
    <BBWidget widgetTitle="Account Deleted">
      <div className="p-4 space-y-3 max-w-xl">
        <p className="font-bold">Your account has been deleted.</p>
        <p className="text-sm">
          Your identity, email address, and personal information have been
          removed, and your content is being handled according to the option you
          chose. You have been signed out everywhere.
        </p>
        <p className="text-sm text-dimmed">
          Any page still showing you logged in will sign out on its own.
        </p>
        <p className="text-sm">Thanks for being part of ZFGC. Take care.</p>
        <BBLink to="/">Return to home</BBLink>
      </div>
    </BBWidget>
  );
}
