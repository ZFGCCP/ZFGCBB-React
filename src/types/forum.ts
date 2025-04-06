import type { BaseBB, BBPermission } from "./api";
import type { User } from "./user";

export type Forum = BaseBB & {
  categories: Category[];
  boardName: String;
};
export type Board = BaseBB & {
  boardName: String;
  description: String;
  categoryId: number;
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
  parentCategoryId: number;
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
  threadId: number;
  threadName: String;
  messageId: number;
  messageHistoryId: number;
  createdTsAsString: String;
  ownerName: String;
  ownerId: number;
  lastPostTsAsString: String;
};

export type Message = BaseBB & {
  ownerId: number;
  threadId: number;
  currentMessage: MessageHistory;

  createdUser: User;
  createdTsAsString: string;
};

export type MessageHistory = BaseBB & {
  messageId: number;
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
