import * as v from "valibot";

export const AvatarSchema = v.object({
  id: v.number(),
  userId: v.optional(v.number()),
  activeFlag: v.boolean(),
  url: v.optional(
    v.custom<`${string}://${string}/${string}`>(
      (value) => typeof value === "string",
    ),
  ),
  contentResourceId: v.optional(v.number()),
});

export const EmailAddressSchema = v.object({
  id: baseIdSchema,
  emailAddress: v.optional(v.string()),
  spammerFlag: v.boolean(),
});

export const UserContactInfoSchema = v.object({
  id: baseIdSchema,
  emailAddress: v.optional(EmailAddressSchema),
  allowEmailFlag: v.boolean(),
  allowPmFlag: v.boolean(),
});

export const PermissionSchema = v.object({
  id: baseIdSchema,
  permissionCode: v.string(),
  permissionName: v.optional(v.string()),
});

export const AwardSchema = v.object({
  awardId: v.optional(v.number()),
  code: v.string(),
  name: v.string(),
  description: v.optional(v.string()),
  icon: v.optional(v.string()),
  reason: v.optional(v.string()),
  grantedTs: v.optional(v.string()),
  contentEntityId: v.optional(v.number()),
});

export const AwardCatalogSchema = v.array(AwardSchema);

export const ReactionSummarySchema = v.object({
  reputationPoints: v.number(),
  positiveCount: v.number(),
  negativeCount: v.number(),
  reactionCount: v.number(),
});

export const UserBioInfoSchema = v.object({
  id: baseIdSchema,
  personalText: v.optional(v.string()),
  customTitle: v.optional(v.string()),
  userId: v.optional(v.number()),
  signature: v.optional(v.string()),
  signatureParsed: v.optional(v.string()),
  avatar: v.optional(AvatarSchema),
  birthDate: v.optional(v.string()),
  genderId: v.optional(v.number()),
  dateRegistered: v.optional(v.string()),
  hideEmailFlag: v.optional(v.boolean()),
  postCount: v.optional(v.number()),
});

export const UserSettingsSchema = v.object({
  theme: v.optional(v.nullable(v.string())),
  smileySet: v.optional(v.nullable(v.string())),
  notifyAnnouncementsFlag: v.optional(v.nullable(v.boolean())),
  notifySendBodyFlag: v.optional(v.nullable(v.boolean())),
  sendHappyBirthdayFlag: v.optional(v.nullable(v.boolean())),
});
export type UserSettings = v.InferOutput<typeof UserSettingsSchema>;

export const UserSchema = v.object({
  id: baseIdSchema,
  displayName: v.string(),
  activeFlag: v.optional(v.boolean()),
  theme: v.optional(v.string()),
  settings: v.optional(UserSettingsSchema),
  bioInfo: v.optional(UserBioInfoSchema),
  contactInfo: v.optional(UserContactInfoSchema),
  permissions: v.optional(v.array(PermissionSchema)),
  reactionSummary: v.optional(ReactionSummarySchema),
  awards: v.optional(v.array(AwardSchema)),
});

export const LoggedInUserResponseSchema = v.pipe(
  v.object({ user: UserSchema }),
  v.transform(({ user }) => user),
);

export const UserListSchema = v.array(UserSchema);

export const DeletionModeSchema = v.picklist(["ANONYMIZE", "PURGE"]);

export const UserSummarySchema = v.object({
  userId: v.number(),
  userName: v.optional(v.string()),
  displayName: v.string(),
  siteAdmin: v.boolean(),
});
export const UserSummaryListSchema = v.array(UserSummarySchema);
export type UserSummary = v.InferOutput<typeof UserSummarySchema>;

export const AccountDeletionStatusSchema = v.picklist([
  "NONE",
  "PENDING",
  "SUPERSEDED",
  "CANCELLED",
  "CONFIRMED",
  "EXECUTING",
  "COMPLETED",
]);
export type AccountDeletionStatus = v.InferOutput<
  typeof AccountDeletionStatusSchema
>;

export const AccountDeletionStateSchema = v.object({
  status: AccountDeletionStatusSchema,
  mode: v.optional(v.nullable(DeletionModeSchema)),
  expiresTs: v.optional(v.nullable(v.string())),
  resendCount: v.optional(v.nullable(v.number())),
  lastSentTs: v.optional(v.nullable(v.string())),
});
export type AccountDeletionState = v.InferOutput<
  typeof AccountDeletionStateSchema
>;

export const AccountDeletionPreviewSchema = v.object({
  messageCount: v.number(),
  threadCount: v.number(),
  pollCount: v.number(),
  contentResourceCount: v.number(),
  wikiPageCount: v.number(),
  projectCount: v.number(),
  resourceCount: v.number(),
  sentPersonalMessageCount: v.number(),
  adminReplacementRequired: v.boolean(),
});
export type AccountDeletionPreview = v.InferOutput<
  typeof AccountDeletionPreviewSchema
>;

export const AccountDeletionVerifyFormSchema = v.object({
  password: v.pipe(
    v.string(),
    v.nonEmpty("Your current password is required."),
  ),
  confirmationPhrase: v.pipe(
    v.string(),
    v.nonEmpty("Type your username to confirm."),
  ),
});
export type AccountDeletionVerifyForm = v.InferOutput<
  typeof AccountDeletionVerifyFormSchema
>;
