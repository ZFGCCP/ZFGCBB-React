import * as v from "valibot";

export const MessageFormSchema = v.object({
  body: v.pipe(
    v.string(),
    v.nonEmpty("Message cannot be empty."),
    v.maxLength(20000, "Message is too long."),
  ),
});

export type MessageForm = v.InferOutput<typeof MessageFormSchema>;

export const ChildBoardSchema = v.object({
  boardId: v.number(),
  boardName: v.string(),
  parentBoardId: v.number(),
});

export const BoardSummarySchema = v.object({
  id: baseIdSchema,
  boardId: v.number(),
  description: v.optional(v.string()),
  boardName: v.string(),
  threadCount: v.number(),
  postCount: v.number(),
  latestThreadId: v.optional(v.number()),
  latestMessageOwnerId: v.optional(v.number()),
  latestMessageUserName: v.optional(v.string()),
  latestMessageCreatedTs: v.optional(v.string()),
  threadName: v.optional(v.string()),
  childBoards: v.optional(v.array(ChildBoardSchema)),
});

export const CategorySchema = v.object({
  id: baseIdSchema,
  categoryName: v.string(),
  description: v.optional(v.string()),
  parentCategoryId: v.optional(v.number()),
  boards: v.array(BoardSummarySchema),
});

export const MessageHistorySchema = v.object({
  id: baseIdSchema,
  messageId: v.number(),
  messageText: v.string(),
  contentFormat: v.optional(ContentFormatSchema),
  currentFlag: v.optional(v.boolean()),
  createdTs: v.optional(v.string()),
  updatedTs: v.optional(v.string()),
});

export const FileAttachmentSchema = v.object({
  id: baseIdSchema,
  fileAttachmentId: v.number(),
  contentResourceId: v.number(),
  filename: v.optional(v.string()),
  mimeType: v.optional(v.string()),
  fileSize: v.optional(v.number()),
  downloads: v.number(),
});

export const MessageSchema = v.object({
  id: idSchema,
  ownerId: v.optional(v.number()),
  threadId: v.number(),
  currentMessage: MessageHistorySchema,
  fileAttachments: v.optional(v.array(FileAttachmentSchema)),
  createdUser: v.optional(UserSchema),
  createdTs: v.optional(v.string()),
  updatedTs: v.optional(v.string()),
});

export const LatestMessageSchema = v.object({
  threadId: v.number(),
  threadName: v.string(),
  ownerId: v.optional(v.number()),
  ownerName: v.string(),
  lastPostTs: v.optional(v.string()),
});

export const PollChoiceSchema = v.object({
  id: baseIdSchema,
  pollId: v.optional(v.number()),
  choiceText: v.optional(v.string()),
  activeFlag: v.boolean(),
  votes: v.number(),
  seqno: v.number(),
  percentage: v.optional(v.number()),
});

export const PollInfoSchema = v.object({
  id: baseIdSchema,
  pollQuestion: v.optional(v.string()),
  threadId: v.number(),
  votingLockedFlag: v.boolean(),
  expireTime: v.optional(v.string()),
  hideResultsFlag: v.boolean(),
  changeVoteFlag: v.boolean(),
  createdUserId: v.optional(v.number()),
  guestVoteFlag: v.boolean(),
  guestVoteCount: v.number(),
  maxVotes: v.optional(v.number()),
  votes: v.number(),
  answers: v.array(PollChoiceSchema),
});

export const ThreadSchema = v.object({
  id: baseIdSchema,
  threadName: v.string(),
  lockedFlag: v.boolean(),
  pinnedFlag: v.boolean(),
  boardId: v.number(),
  boardName: v.string(),
  createdUserId: v.optional(v.number()),
  createdUser: v.optional(UserSchema),
  postCount: v.optional(v.number()),
  viewCount: v.number(),
  pageCount: v.number(),
  pollInfo: v.optional(PollInfoSchema),
  messages: v.array(MessageSchema),
  recycleBinEnabled: v.optional(v.boolean()),
  recycledFromBoardId: v.optional(v.number()),
  recycledFromThreadId: v.optional(v.number()),
});

export const MessageDeletionResponseSchema = v.object({
  outcome: v.picklist(["RECYCLED", "PURGED"]),
  originThreadRecycled: v.boolean(),
  originThreadDeleted: v.boolean(),
  threadId: v.optional(v.number()),
  boardId: v.optional(v.number()),
  recycleThreadId: v.optional(v.number()),
  pageCount: v.optional(v.number()),
});
export type MessageDeletionResponse = v.InferOutput<
  typeof MessageDeletionResponseSchema
>;

export const ThreadDeletionResponseSchema = v.object({
  outcome: v.picklist(["RECYCLED", "PURGED"]),
  boardId: v.optional(v.number()),
  recycleThreadId: v.optional(v.number()),
});
export type ThreadDeletionResponse = v.InferOutput<
  typeof ThreadDeletionResponseSchema
>;

export const RestoreResponseSchema = v.object({
  mode: v.picklist(["MERGED_INTO_ORIGIN", "THREAD_RESTORED"]),
  threadId: v.optional(v.number()),
  boardId: v.optional(v.number()),
  postInThread: v.optional(v.number()),
});
export type RestoreResponse = v.InferOutput<typeof RestoreResponseSchema>;

export const ThreadSummarySchema = v.object({
  id: idSchema,
  threadName: v.string(),
  boardId: v.number(),
  lockedFlag: v.boolean(),
  pinnedFlag: v.boolean(),
  createdUserId: v.optional(v.number()),
  createdUser: UserSchema,
  postCount: v.number(),
  viewCount: v.number(),
  createdTs: v.optional(v.string()),
  latestMessage: LatestMessageSchema,
});

export const BoardSchema = v.object({
  id: baseIdSchema,
  boardName: v.string(),
  description: v.optional(v.string()),
  categoryId: v.number(),
  threadCount: v.number(),
  parentBoardId: v.optional(v.number()),
  stickyThreads: v.array(ThreadSummarySchema),
  unStickyThreads: v.array(ThreadSummarySchema),
  pageCount: v.number(),
  childBoards: v.optional(v.array(BoardSummarySchema)),
});

export const ForumSchema = v.object({
  id: baseIdSchema,
  categories: v.array(CategorySchema),
  boardName: v.string(),
});

export const EntityThreadRefSchema = v.object({
  threadId: v.optional(v.number()),
});

export const BbCodeToggleSchema = v.object({
  code: v.string(),
  enabled: v.boolean(),
});
export const BbCodeToggleListSchema = v.array(BbCodeToggleSchema);
export type BbCodeToggle = v.InferOutput<typeof BbCodeToggleSchema>;
