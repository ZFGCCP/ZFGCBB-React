import { BaseBB } from "./api";

export type User = BaseBB & {
    displayName: String,
    theme?: String
};