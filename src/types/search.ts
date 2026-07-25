import type * as v from "valibot";

export type SearchHit = v.InferOutput<typeof SearchHitSchema>;
export type SearchGroup = v.InferOutput<typeof SearchGroupSchema>;
export type SearchResults = v.InferOutput<typeof SearchResultsSchema>;
export type SearchRealm = v.InferOutput<typeof SearchRealmSchema>;
