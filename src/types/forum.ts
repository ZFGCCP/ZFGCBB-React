import type { BaseBB, BBPermission } from "./api";
import type { User } from "./user";

export type Forum = BaseBB & {
  categories: Category[];
  boardName: String;
};
export type Board = BaseBB & {
  boardName: String;
  description: String;
  categoryId: Number;
  threadCount: number;
  parentBoardId: number;
  stickyThreads: Thread[];
  unStickyThreads: Thread[];
  pageCount: number;
  childBoards?: BoardSummary[];
};

export type BoardSummary = BaseBB & {
  boardId: number;
  description: string;
  boardName: string;
  threadCount: number;
  postCount: number;
  latestMessageId: number;
  latestThreadId: number;
  latestMessageOwnerId: number;
  latestMessageUserName: string;
  categoryId: number;
  parentBoardId: number;
};

export type Category = BaseBB & {
  categoryName: String;
  description: String;
  parentCategoryId: Number;
  boards: BoardSummary[];
};

export type Thread = BaseBB & {
  threadName: String;
  lockedFlag: Boolean;
  pinnedFlag: Boolean;
  boardId: Number;
  createdUserId: Number;
  createdUser: User;
  postCount: Number;
  viewCount: Number;

  messages: Message[];
  latestMessage?: LatestMessage;
};

export type LatestMessage = {
  threadId: Number;
  threadName: String;
  messageId: Number;
  messageHistoryId: Number;
  createdTsAsString: String;
  ownerName: String;
};

export type Message = BaseBB & {
  ownerId: Number;
  threadId: Number;
  currentMessage: MessageHistory;

  createdUser: User;
};

export type MessageHistory = BaseBB & {
  messageId: Number;
  messageText: String;
  unparsedText: String;
  currentFlag?: Boolean;
  createdTsAsString: string;
};

export type BBPermissionLabel = {
  label: string;
  callback: () => void;
  permissions: BBPermission[];
};
