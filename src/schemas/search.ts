import * as v from "valibot";

export const SearchHitSchema = v.object({
  type: v.string(),
  title: v.string(),
  snippet: v.optional(v.string()),
  context: v.optional(v.string()),
  url: v.string(),
});

export const SearchGroupSchema = v.object({
  type: v.string(),
  label: v.string(),
  total: v.number(),
  hits: v.array(SearchHitSchema),
});

export const SearchResultsSchema = v.object({
  query: v.string(),
  total: v.number(),
  groups: v.array(SearchGroupSchema),
});

export const SearchRealmSchema = v.object({
  type: v.string(),
  label: v.string(),
});

export const SearchRealmListSchema = v.array(SearchRealmSchema);
