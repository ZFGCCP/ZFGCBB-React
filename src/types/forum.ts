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

// FIXME: #98 Id is undefined on some responses, so the types are wrong for BaseBB.
export type BoardSummary = BaseBB & {
  boardId: number;
  description: string;
  boardName: string;
  threadCount: number;
  postCount: number;
  latestMessageId?: number;
  latestThreadId?: number;
  latestMessageOwnerId?: number;
  latestMessageUserName?: string;
  categoryId: number;
  parentBoardId: number;
  latestMessageCreatedTsAsString: string;
  threadName: string;

  childBoards?: ChildBoard[];
};

export type ChildBoard = {
  boardId: number;
  boardName: string;
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
  boardId: number;
  createdUserId: number;
  createdUser: User;
  postCount: number;
  viewCount: number;
  pageCount: number;

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
  lastPostTsAsString: String;
};

export type Message = BaseBB & {
  ownerId: Number;
  threadId: Number;
  currentMessage: MessageHistory;

  createdUser: User;
  createdTsAsString: string;
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
