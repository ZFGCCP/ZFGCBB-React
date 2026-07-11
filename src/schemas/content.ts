import * as v from "valibot";

export const WikiPageRefSchema = v.object({
  namespace: v.string(),
  title: v.string(),
  slug: v.string(),
});

export const WikiCategoryCountSchema = v.object({
  name: v.string(),
  count: v.number(),
});

export const WikiNavItemSchema = v.object({
  label: v.string(),
  to: v.string(),
});

export const WikiNavSectionSchema = v.object({
  title: v.string(),
  items: v.array(WikiNavItemSchema),
});

export const WikiConfigSchema = v.object({
  siteName: v.string(),
  namespaces: v.array(v.string()),
  nav: v.array(WikiNavSectionSchema),
});

export const WikiRevisionRefSchema = v.object({
  revisionId: v.number(),
  page: v.optional(WikiPageRefSchema),
  authoredTs: v.optional(v.string()),
  authorName: v.optional(v.string()),
  summary: v.optional(v.string()),
  size: v.number(),
  current: v.boolean(),
});

export const WikiFileRefSchema = v.object({
  contentResourceId: v.number(),
  filename: v.optional(v.string()),
  mimeType: v.optional(v.string()),
  fileSize: v.optional(v.number()),
});

export const WikiHeadingSchema = v.object({
  level: v.number(),
  text: v.string(),
  id: v.string(),
});

export const WikiPageSchema = v.object({
  id: idSchema,
  namespace: v.string(),
  title: v.string(),
  slug: v.string(),
  redirectTo: v.optional(v.string()),
  content: v.optional(v.string()),
  contentParsed: v.optional(v.string()),
  contentFormat: v.optional(v.string()),
  categories: v.array(v.string()),
  categoryMembers: v.array(WikiPageRefSchema),
  revision: v.optional(WikiRevisionRefSchema),
  file: v.optional(WikiFileRefSchema),
  headings: v.optional(v.array(WikiHeadingSchema)),
  toc: v.optional(v.boolean()),
  entityUrl: v.optional(
    v.custom<`/${string}`>((value) => typeof value === "string"),
  ),
});

export const WikiStatisticsSchema = v.object({
  totalPages: v.number(),
  byNamespace: v.record(v.string(), v.number()),
  categories: v.number(),
  redirects: v.number(),
});

export const ProjectScreenshotSchema = v.object({
  contentResourceId: v.optional(v.number()),
  caption: v.optional(v.string()),
  ordinal: v.number(),
});

export const ProjectDownloadSchema = v.object({
  contentResourceId: v.optional(v.number()),
  label: v.optional(v.string()),
  url: v.optional(v.string()),
  filename: v.optional(v.string()),
  fileSize: v.optional(v.number()),
  publishedTs: v.optional(v.string()),
  ordinal: v.number(),
});

export const ArchiveEntrySchema = v.object({
  name: v.string(),
  size: v.number(),
});

export const ProjectNewsSchema = v.object({
  threadId: v.optional(v.number()),
  threadName: v.optional(v.string()),
  subject: v.optional(v.string()),
  body: v.optional(v.string()),
  authorUserId: v.optional(v.number()),
  authorName: v.optional(v.string()),
  publishedTs: v.optional(v.string()),
});

export const TeamMemberSchema = v.object({
  userId: v.number(),
  displayName: v.optional(v.string()),
  memberRole: v.optional(v.string()),
});

export const TeamInfoSchema = v.object({
  teamId: v.number(),
  name: v.string(),
  description: v.optional(v.string()),
  members: v.array(TeamMemberSchema),
});

export const FacetValueSchema = v.object({
  value: v.string(),
  count: v.number(),
});

export const ProjectFacetsSchema = v.object({
  languages: v.array(FacetValueSchema),
  statuses: v.array(FacetValueSchema),
});

export const ResourceFacetsSchema = v.object({
  types: v.array(FacetValueSchema),
});

export const ProjectSchema = v.object({
  id: idSchema,
  title: v.string(),
  slug: v.string(),
  status: v.string(),
  progress: v.number(),
  summary: v.optional(v.string()),
  summaryText: v.optional(v.string()),
  language: v.optional(v.string()),
  requirements: v.optional(v.string()),
  threadId: v.optional(v.number()),
  wikiPageId: v.optional(v.number()),
  previewContentResourceId: v.optional(v.number()),
  viewCount: v.optional(v.number()),
  downloadCount: v.optional(v.number()),
  author: v.optional(v.string()),
  createdUserId: v.optional(v.number()),
  publishedTs: v.optional(v.string()),
  lastUpdatedTs: v.optional(v.string()),
  rating: v.optional(v.number()),
  voteCount: v.optional(v.number()),
  screenshots: v.array(ProjectScreenshotSchema),
  downloads: v.array(ProjectDownloadSchema),
  tags: v.array(v.string()),
  news: v.array(ProjectNewsSchema),
  team: v.optional(TeamInfoSchema),
  page: v.optional(WikiPageSchema),
});

export const ResourceSchema = v.object({
  id: idSchema,
  title: v.string(),
  slug: v.string(),
  resourceType: v.optional(v.string()),
  summary: v.optional(v.string()),
  summaryText: v.optional(v.string()),
  fileSize: v.optional(v.number()),
  downloadUrl: v.optional(v.string()),
  threadId: v.optional(v.number()),
  wikiPageId: v.optional(v.number()),
  downloadContentResourceId: v.optional(v.number()),
  downloadFilename: v.optional(v.string()),
  previewContentResourceId: v.optional(v.number()),
  viewCount: v.optional(v.number()),
  downloadCount: v.optional(v.number()),
  author: v.optional(v.string()),
  createdUserId: v.optional(v.number()),
  publishedTs: v.optional(v.string()),
  lastUpdatedTs: v.optional(v.string()),
  rating: v.optional(v.number()),
  voteCount: v.optional(v.number()),
  page: v.optional(WikiPageSchema),
});

export const pagedSchema = <TItem extends v.GenericSchema>(item: TItem) =>
  v.object({
    items: v.array(item),
    total: v.number(),
    page: v.number(),
    pageSize: v.number(),
  });

export const MergeCandidateSchema = v.object({
  sourceType: v.picklist(["PROJECT", "RESOURCE"]),
  sourceId: v.number(),
  sourceTitle: v.string(),
  sourceSlug: v.optional(v.string()),
  targetType: v.picklist(["WIKI_PAGE", "PROJECT", "THREAD"]),
  targetId: v.number(),
  targetTitle: v.string(),
  targetSlug: v.optional(v.string()),
  confidence: v.number(),
  reason: v.string(),
});

export const CmsConfigSchema = v.object({
  discussionBoardId: v.optional(v.string()),
});

export const ProjectShowcaseSchema = v.object({
  featured: v.optional(ProjectSchema),
  recent: v.array(ProjectSchema),
  random: v.array(ProjectSchema),
  topRated: v.array(ProjectSchema),
  mostDownloaded: v.array(ProjectSchema),
  totalProjects: v.number(),
});

export const ResourceShowcaseSchema = v.object({
  featured: v.optional(ResourceSchema),
  recent: v.array(ResourceSchema),
  random: v.array(ResourceSchema),
  topRated: v.array(ResourceSchema),
  mostDownloaded: v.array(ResourceSchema),
  totalResources: v.number(),
});

export const WikiPreviewSchema = v.object({
  contentParsed: v.string(),
});

export const BbcodeListSchema = v.array(
  v.object({
    code: v.string(),
    selfClosing: v.boolean(),
  }),
);

export const WikiRevisionSubmitSchema = v.object({
  revisionId: v.number(),
  status: v.optional(v.nullable(v.string())),
});

export const WikiRevisionRefListSchema = v.array(WikiRevisionRefSchema);
export const WikiCategoryCountListSchema = v.array(WikiCategoryCountSchema);
export const WikiPageRefListSchema = v.array(WikiPageRefSchema);
export const ArchiveEntryListSchema = v.array(ArchiveEntrySchema);
export const MergeCandidateListSchema = v.array(MergeCandidateSchema);
