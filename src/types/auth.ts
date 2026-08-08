import type { BaseBB } from "./api";

export type AuthCredentials = BaseBB & {
  username: string;
  password: string;
  grant_type: string;
  scope: string;
};

export type RefreshRequest = BaseBB & {
  refreshToken: string;
};

export type TokenPair = BaseBB & {
  accessToken: string;
  refreshToken: string;
};
