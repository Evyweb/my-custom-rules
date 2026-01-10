import {Comment} from "estree";

export const findComment = (comments: Comment[], label: string) => comments.find((c) => new RegExp(`^${label}$`, 'i').test(c.value.trim()));
