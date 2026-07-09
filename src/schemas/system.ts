import * as v from "valibot";

export const JOB_TYPES = [
  "MIGRATE_SMF_INSTALLATION",
  "USERS",
  "CATEGORIES",
  "BOARDS",
  "THREADS",
  "MESSAGES",
  "IPS",
  "MESSAGE_HISTORY",
  "USER_BIO_INFO",
  "ATTACHMENTS",
  "ATTACHMENT_FILES",
  "BBCODE_REWRITE",
  "USER_CONTACT_INFO",
  "POLLS",
  "POLL_CHOICES",
  "USER_POLL_CHOICES",
  "KARMA",
  "WIKI_PAGES",
  "PROJECTS",
  "RESOURCES",
  "MIGRATE_CMS_INSTALLATION",
] as const;

export const JobTypeSchema = v.picklist(JOB_TYPES);
export type JobType = v.InferOutput<typeof JobTypeSchema>;

export const JobStateSchema = v.picklist([
  "QUEUED",
  "RUNNING",
  "COMPLETED",
  "FAILED",
  "CANCELLED",
] as const);
export type JobState = v.InferOutput<typeof JobStateSchema>;

export const JobSchema = v.object({
  id: v.string(),
  type: JobTypeSchema,
  state: JobStateSchema,
  submittedAt: v.string(),
  startedAt: v.optional(v.string()),
  finishedAt: v.optional(v.string()),
  error: v.optional(v.string()),
});
export type Job = v.InferOutput<typeof JobSchema>;

export const JobListSchema = v.array(JobSchema);

export const InstallStatusResponseSchema = v.object({
  installed: v.boolean(),
  siteName: v.optional(v.string()),
});
export type InstallStatusResponse = v.InferOutput<
  typeof InstallStatusResponseSchema
>;

export const SiteInfoSchema = v.object({
  siteName: v.optional(v.string()),
  registrationEnabled: v.boolean(),
});
export type SiteInfo = v.InferOutput<typeof SiteInfoSchema>;

export const InstallResponseSchema = v.object({
  installed: v.boolean(),
  adminUserId: v.number(),
  siteName: v.string(),
  sampleDataApplied: v.boolean(),
  accessToken: v.optional(v.string()),
  refreshToken: v.optional(v.string()),
});
export type InstallResponse = v.InferOutput<typeof InstallResponseSchema>;

export const MigrateJobFormSchema = v.object({
  type: JobTypeSchema,
  smfHost: v.pipe(v.string(), v.nonEmpty("Host is required.")),
  smfPort: v.pipe(
    v.string(),
    v.nonEmpty("Port is required."),
    v.regex(/^\d+$/, "Port must be a positive integer."),
  ),
  smfDatabase: v.pipe(v.string(), v.nonEmpty("Database is required.")),
  smfUser: v.pipe(v.string(), v.nonEmpty("Username is required.")),
  smfPassword: v.pipe(v.string(), v.nonEmpty("Password is required.")),
  smfTablePrefix: v.string(),
  smfLegacyHost: v.string(),
  attachmentsSourcePath: v.string(),
  attachmentsTargetPath: v.string(),
  cmsFilesSourcePath: v.string(),
  wikiImagesSourcePath: v.string(),
  force: v.boolean(),
});

export type MigrateJobForm = v.InferOutput<typeof MigrateJobFormSchema>;

export type MigrateJobRequest = {
  type: JobType;
  smfHost: string;
  smfPort?: number;
  smfDatabase: string;
  smfUser: string;
  smfPassword: string;
  smfTablePrefix?: string;
  smfLegacyHost?: string;
  attachmentsSourcePath?: string;
  attachmentsTargetPath?: string;
  avatarsSourcePath?: string;
  cmsFilesSourcePath?: string;
  wikiImagesSourcePath?: string;
  force?: boolean;
};

export const MigrateUploadResponseSchema = v.object({
  uploadId: v.string(),
  attachmentsSourcePath: v.optional(v.string()),
  avatarsSourcePath: v.optional(v.string()),
});
export type MigrateUploadResponse = v.InferOutput<
  typeof MigrateUploadResponseSchema
>;

export const MigrateDetectResponseSchema = v.object({
  detected: v.number(),
});

export const ConflictCandidateSchema = v.object({
  sourceType: v.string(),
  sourceRef: v.string(),
  value: v.string(),
  label: v.string(),
});
export type ConflictCandidate = v.InferOutput<typeof ConflictCandidateSchema>;

export const MigrationConflictSchema = v.object({
  id: v.number(),
  entityType: v.string(),
  entityId: v.number(),
  entityLabel: v.optional(v.string()),
  fieldName: v.string(),
  candidates: v.array(ConflictCandidateSchema),
  status: v.string(),
});
export type MigrationConflict = v.InferOutput<typeof MigrationConflictSchema>;

export const MigrationConflictListSchema = v.array(MigrationConflictSchema);

export const CmsConfigFormSchema = v.object({
  discussionBoardId: v.pipe(
    v.string(),
    v.nonEmpty("Discussion board id is required."),
    v.regex(/^\d+$/, "Discussion board id must be a number."),
  ),
});
export type CmsConfigForm = v.InferOutput<typeof CmsConfigFormSchema>;

export const InstallFormSchema = v.object({
  installToken: v.pipe(v.string(), v.nonEmpty("Install token is required.")),
  adminUserName: v.pipe(v.string(), v.nonEmpty("Admin username is required.")),
  adminDisplayName: v.pipe(
    v.string(),
    v.nonEmpty("Admin display name is required."),
  ),
  adminEmail: v.pipe(
    v.string(),
    v.nonEmpty("Admin email is required."),
    v.email("Must be a valid email address."),
  ),
  adminPassword: v.pipe(
    v.string(),
    v.nonEmpty("Admin password is required."),
    v.minLength(8, "Password must be at least 8 characters."),
  ),
  siteName: v.pipe(v.string(), v.nonEmpty("Site name is required.")),
  applySampleData: v.boolean(),
});

export type InstallForm = v.InferOutput<typeof InstallFormSchema>;
