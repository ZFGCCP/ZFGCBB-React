import type { BaseBB, BBPermission } from "./api";
import type { Theme } from "./theme";

export type User = BaseBB & {
  displayName: string;
  theme?: Theme;

  bioInfo?: UserBioInfo;

  permissions?: Permission[];
};

export type UserBioInfo = BaseBB & {
  personalText?: string;
  customTitle?: string;
  userId: number;
  signature?: string;
  avatar?: Avatar;
};

export type Avatar = BaseBB & {
  userId: number;
  id: number;
  activeFlag: boolean;
  url?: string;
  contentResourceId?: number;
};

export type Permission = BaseBB & {
  permissionCode: string;
  permissionName: BBPermission;
};
