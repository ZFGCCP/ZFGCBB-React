import { BaseBB } from "./api";

export type User = BaseBB & {
    displayName: string,
    theme?: string,

    bioInfo?: UserBioInfo
};

export type UserBioInfo = BaseBB & {
    personalText?: string,
    customTitle?: string,
    userId: number
};