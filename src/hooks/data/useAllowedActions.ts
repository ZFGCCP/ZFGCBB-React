import * as v from "valibot";

const AllowedActionsSchema = v.array(v.string());

export function useAllowedActions(path: `/${string}`, enabled = true) {
  const query = useBBQuery(path, {
    schema: AllowedActionsSchema,
    enabled,
    staleTime: 0,
    gcTime: 0,
    meta: { userScoped: true, persist: false },
  });
  return {
    actions: new Set(query.data ?? []),
    isLoaded: query.data !== undefined,
  };
}
