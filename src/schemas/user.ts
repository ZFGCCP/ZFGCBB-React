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
  permissionName: v.optional(BBPermissionSchema),
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
  reactionSummary: v.optional(
    v.object({
      reputationPoints: v.optional(v.number()),
      positiveCount: v.optional(v.number()),
      negativeCount: v.optional(v.number()),
      reactionCount: v.optional(v.number()),
    }),
  ),
  dateRegistered: v.optional(v.string()),
  hideEmailFlag: v.optional(v.boolean()),
  postCount: v.optional(v.number()),
});

export const UserSchema = v.object({
  id: baseIdSchema,
  displayName: v.string(),
  theme: v.optional(v.string()),
  bioInfo: v.optional(UserBioInfoSchema),
  contactInfo: v.optional(UserContactInfoSchema),
  permissions: v.optional(v.array(PermissionSchema)),
});

export const UserListSchema = v.array(UserSchema);
