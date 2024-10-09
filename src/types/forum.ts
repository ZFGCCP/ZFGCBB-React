import { BaseBB } from "./api";
import { User } from "./user";

export type Forum = BaseBB & {
  categories: Category[];
  boardName: String;
  //private List<Thread> stickyThreads = new ArrayList<>();
  threads: Thread[];
  categoryId: Number;
};
export type Board = BaseBB & {
  boardName: String;
  description: String;
  categoryId: Number;
  forumId: Number;
};

export type Category = BaseBB & {
  categoryName: String;
  description: String;
  parentCategoryId: Number;
  boards: Board[];
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
