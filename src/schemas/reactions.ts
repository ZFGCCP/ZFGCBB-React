import * as v from "valibot";

export const ReactableTypeSchema = v.picklist([
  "MESSAGE",
  "PROJECT",
  "RESOURCE",
  "WIKI_PAGE",
]);

export const ReactionTypeSchema = v.object({
  reactionTypeId: v.number(),
  code: v.string(),
  label: v.string(),
  icon: v.optional(v.string()),
  points: v.number(),
  ordinal: v.number(),
});

export const ReactionTallySchema = v.object({
  ...ReactionTypeSchema.entries,
  count: v.number(),
});

export const ContentReactionSummarySchema = v.object({
  reactableType: ReactableTypeSchema,
  reactableId: v.number(),
  totalPoints: v.number(),
  totalCount: v.number(),
  userReactionTypeId: v.optional(v.number()),
  tallies: v.array(ReactionTallySchema),
});

export const ReactionTypeListSchema = v.array(ReactionTypeSchema);

export const ContentReactionSummaryListSchema = v.array(
  ContentReactionSummarySchema,
);

export type ReactableType = v.InferOutput<typeof ReactableTypeSchema>;
export type ReactionTally = v.InferOutput<typeof ReactionTallySchema>;
export type ContentReactionSummary = v.InferOutput<
  typeof ContentReactionSummarySchema
>;
