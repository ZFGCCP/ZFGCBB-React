import type { BaseBB } from "./api";

export type WikiPageRef = {
  namespace: string;
  title: string;
  slug: string;
};

export type WikiCategoryCount = {
  name: string;
  count: number;
};

export type WikiNavItem = {
  label: string;
  to: string;
};

export type WikiNavSection = {
  title: string;
  items: WikiNavItem[];
};

export type WikiConfig = {
  siteName: string;
  namespaces: string[];
  nav: WikiNavSection[];
};

export type WikiRevisionRef = {
  revisionId: number;
  page: WikiPageRef | null;
  authoredTs: string | null;
  authorName: string | null;
  summary: string | null;
  size: number;
  current: boolean;
};

export type WikiFileRef = {
  contentResourceId: number;
  filename: string | null;
  mimeType: string | null;
  fileSize: number | null;
};

export type WikiHeading = {
  level: number;
  text: string;
  id: string;
};

export type WikiPage = BaseBB & {
  namespace: string;
  title: string;
  slug: string;
  redirectTo: string | null;
  content: string | null;
  contentParsed: string | null;
  contentFormat: string | null;
  categories: string[];
  categoryMembers: WikiPageRef[];
  revision: WikiRevisionRef | null;
  file: WikiFileRef | null;
  headings?: WikiHeading[];
  toc?: boolean;
  entityUrl?: `/${string}` | null;
};

export type ProjectScreenshot = {
  contentResourceId: number | null;
  caption: string | null;
  ordinal: number;
};

export type ProjectDownload = {
  contentResourceId: number | null;
  label: string | null;
  url: string | null;
  filename: string | null;
  fileSize: number | null;
  publishedTs: string | null;
  ordinal: number;
};

export type ArchiveEntry = {
  name: string;
  size: number;
};

export type ProjectNews = {
  threadId: number | null;
  threadName: string | null;
  subject: string | null;
  body: string | null;
  authorUserId: number | null;
  authorName: string | null;
  publishedTs: string | null;
};

export type TeamMember = {
  userId: number;
  displayName: string | null;
  memberRole: string | null;
};

export type TeamInfo = {
  teamId: number;
  name: string;
  description: string | null;
  members: TeamMember[];
};

export type FacetValue = { value: string; count: number };

export type ProjectFacets = {
  languages: FacetValue[];
  statuses: FacetValue[];
};

export type ResourceFacets = {
  types: FacetValue[];
};

export type Project = BaseBB & {
  title: string;
  slug: string;
  status: string;
  progress: number;
  summary: string | null;
  summaryText: string | null;
  language: string | null;
  requirements: string | null;
  threadId: number | null;
  wikiPageId: number | null;
  previewContentResourceId: number | null;
  viewCount: number | null;
  downloadCount: number | null;
  author: string | null;
  createdUserId: number | null;
  publishedTs: string | null;
  lastUpdatedTs: string | null;
  rating: number | null;
  voteCount: number | null;
  screenshots: ProjectScreenshot[];
  downloads: ProjectDownload[];
  tags: string[];
  news: ProjectNews[];
  team: TeamInfo | null;
  page: WikiPage | null;
};

export type Resource = BaseBB & {
  title: string;
  slug: string;
  resourceType: string | null;
  summary: string | null;
  summaryText: string | null;
  fileSize: number | null;
  downloadUrl: string | null;
  threadId: number | null;
  wikiPageId: number | null;
  downloadContentResourceId: number | null;
  downloadFilename: string | null;
  previewContentResourceId: number | null;
  viewCount: number | null;
  downloadCount: number | null;
  author: string | null;
  createdUserId: number | null;
  publishedTs: string | null;
  lastUpdatedTs: string | null;
  rating: number | null;
  voteCount: number | null;
  page: WikiPage | null;
};

export type Paged<TItem> = {
  items: TItem[];
  total: number;
  page: number;
  pageSize: number;
};

export type MergeCandidate = {
  sourceType: "PROJECT" | "RESOURCE";
  sourceId: number;
  sourceTitle: string;
  sourceSlug: string | null;
  targetType: "WIKI_PAGE" | "PROJECT" | "THREAD";
  targetId: number;
  targetTitle: string;
  targetSlug: string | null;
  confidence: number;
  reason: string;
};

export type CmsConfig = {
  discussionBoardId: string | null;
};

export type Showcase<TItem> = {
  featured: TItem | null;
  recent: TItem[];
  random: TItem[];
  topRated: TItem[];
  mostDownloaded: TItem[];
};

export type ProjectShowcase = Showcase<Project> & { totalProjects: number };

export type ResourceShowcase = Showcase<Resource> & { totalResources: number };
