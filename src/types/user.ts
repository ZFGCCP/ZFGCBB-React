import type { BaseBB, BBPermission } from "./api";

export type User = BaseBB & {
    displayName: String,
    theme?: String
};