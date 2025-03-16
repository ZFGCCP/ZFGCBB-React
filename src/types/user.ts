import type { BaseBB, BBPermission } from "./api";

export type User = BaseBB & {
  displayName: string;
  theme?: string;

  bioInfo?: UserBioInfo;
  avatar?: Avatar;

  permissions?: Permission[];
};

export type UserBioInfo = BaseBB & {
  personalText?: string;
  customTitle?: string;
  userId: number;
  signature?: string;
};

export type Avatar = BaseBB & {
  userId: number;
  id: number;
  activeFlag: boolean;
  url: string;
};

export type Permission = BaseBB & {
  permissionCode: string;
  permissionName: BBPermission;
};
