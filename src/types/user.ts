import type { BaseBB, BBPermission } from "./api";

export type User = BaseBB & {
    userId: number,
    displayName: String,
    theme?: String
};