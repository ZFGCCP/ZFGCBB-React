import * as v from "valibot";

export type BaseBB = {
  id?: number;
};

export const idSchema = v.pipe(
  v.union([v.number(), v.string()]),
  v.transform(Number),
);

export const baseIdSchema = v.optional(idSchema);

export const BB_PERMISSIONS = [
  "ZFGC_USER",
  "ZFGC_GUEST",
  "ZFGC_PROFILE_VIEWER",
  "ZFGC_PROFILE_EDITOR",
  "ZFGC_PROFILE_ADMIN",
  "ZFGC_MESSAGE_VIEWER",
  "ZFGC_MESSAGE_EDITOR",
  "ZFGC_MESSAGE_ADMIN",
  "ZFGC_READ_ONLY",
  "ZFGC_SITE_ADMIN",
  "ZFGC_SITE_MODERATOR",
  "ZFGC_WIKI_MODERATOR",
] as const;

export const BBPermissionSchema = v.picklist(BB_PERMISSIONS);

export type BBPermission = v.InferOutput<typeof BBPermissionSchema>;
