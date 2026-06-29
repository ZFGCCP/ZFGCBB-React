import type { User } from "@/types/user";

export const BB_ICON_NAMES = [
  "search",
  "close",
  "quote",
  "reply",
  "modify",
  "delete",
  "split",
  "approve",
  "merge",
  "clip",
  "valid",
  "invalid",
  "lock",
  "sticky",
  "move",
  "remove",
  "info",
  "members",
  "calendar",
  "lastpost",
  "online",
  "suspect",
  "sort-up",
  "sort-down",
  "useron",
  "useroff",
  "warn",
  "male",
  "female",
  "history",
  "arrow",
  "nav",
  "topic",
  "unread",
  "download",
  "board",
] as const;
export type BBIconName = (typeof BB_ICON_NAMES)[number];

export const RANK_BADGE_NAMES = [
  "member",
  "mod",
  "gmod",
  "admin",
  "staff",
  "journalist",
] as const;
export type RankBadgeName = (typeof RANK_BADGE_NAMES)[number];

export function rankBadgeFor(user: User | null | undefined): RankBadgeName {
  const perms = user?.permissions?.map((p) => p.permissionName) ?? [];
  if (perms.includes("ZFGC_SITE_ADMIN")) return "admin";
  if (perms.includes("ZFGC_SITE_MODERATOR")) return "gmod";
  if (perms.includes("ZFGC_WIKI_MODERATOR")) return "mod";
  return "member";
}
