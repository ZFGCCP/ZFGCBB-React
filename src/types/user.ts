import type * as v from "valibot";

export type User = v.InferOutput<typeof UserSchema>;
export type UserBioInfo = v.InferOutput<typeof UserBioInfoSchema>;
export type Avatar = v.InferOutput<typeof AvatarSchema>;
export type Permission = v.InferOutput<typeof PermissionSchema>;
export type UserContactInfo = v.InferOutput<typeof UserContactInfoSchema>;
export type EmailAddress = v.InferOutput<typeof EmailAddressSchema>;
export type Award = v.InferOutput<typeof AwardSchema>;
export type ReactionSummary = v.InferOutput<typeof ReactionSummarySchema>;
