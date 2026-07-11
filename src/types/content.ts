import * as v from "valibot";

export type WikiPageRef = v.InferOutput<typeof WikiPageRefSchema>;
export type WikiCategoryCount = v.InferOutput<typeof WikiCategoryCountSchema>;
export type WikiNavItem = v.InferOutput<typeof WikiNavItemSchema>;
export type WikiNavSection = v.InferOutput<typeof WikiNavSectionSchema>;
export type WikiConfig = v.InferOutput<typeof WikiConfigSchema>;
export type WikiRevisionRef = v.InferOutput<typeof WikiRevisionRefSchema>;
export type WikiFileRef = v.InferOutput<typeof WikiFileRefSchema>;
export type WikiHeading = v.InferOutput<typeof WikiHeadingSchema>;
export type WikiPage = v.InferOutput<typeof WikiPageSchema>;
export type ProjectScreenshot = v.InferOutput<typeof ProjectScreenshotSchema>;
export type ProjectDownload = v.InferOutput<typeof ProjectDownloadSchema>;
export type ArchiveEntry = v.InferOutput<typeof ArchiveEntrySchema>;
export type ProjectNews = v.InferOutput<typeof ProjectNewsSchema>;
export type TeamMember = v.InferOutput<typeof TeamMemberSchema>;
export type TeamInfo = v.InferOutput<typeof TeamInfoSchema>;
export type FacetValue = v.InferOutput<typeof FacetValueSchema>;
export type ProjectFacets = v.InferOutput<typeof ProjectFacetsSchema>;
export type ResourceFacets = v.InferOutput<typeof ResourceFacetsSchema>;
export type Project = v.InferOutput<typeof ProjectSchema>;
export type Resource = v.InferOutput<typeof ResourceSchema>;
export type MergeCandidate = v.InferOutput<typeof MergeCandidateSchema>;
export type CmsConfig = v.InferOutput<typeof CmsConfigSchema>;
export type ProjectShowcase = v.InferOutput<typeof ProjectShowcaseSchema>;
export type ResourceShowcase = v.InferOutput<typeof ResourceShowcaseSchema>;

export type Showcase<TItem> = {
  featured?: TItem;
  recent: TItem[];
  random: TItem[];
  topRated: TItem[];
  mostDownloaded: TItem[];
};
