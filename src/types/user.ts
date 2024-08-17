import { BaseBB } from "./api";

export type User = BaseBB & {
    userId: number,
    displayName: String
};