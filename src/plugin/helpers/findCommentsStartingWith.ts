import {Comment} from "estree";

export const findCommentsStartingWith = (comments: Comment[], label: string) => 
  comments.filter((comment) => {
    const trimmedValue = comment.value.trim();
    return trimmedValue.startsWith(label) && trimmedValue !== label;
  });