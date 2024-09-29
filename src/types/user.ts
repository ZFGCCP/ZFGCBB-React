import type { BaseBB, BBPermission } from "./api";

export type User = BaseBB & {
  displayName: string;
  theme?: string;

  bioInfo?: UserBioInfo;
  avatar?: Avatar;
};

export type UserBioInfo = BaseBB & {
  personalText?: string;
  customTitle?: string;
  userId: number;
};

export type Avatar = BaseBB & {
  userId: number;
  id: number;
  activeFlag: boolean;
  url: string;
};
