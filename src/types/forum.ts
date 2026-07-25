import type * as v from "valibot";

export type Forum = v.InferOutput<typeof ForumSchema>;
export type Board = v.InferOutput<typeof BoardSchema>;
export type BoardSummary = v.InferOutput<typeof BoardSummarySchema>;
export type ChildBoard = v.InferOutput<typeof ChildBoardSchema>;
export type Category = v.InferOutput<typeof CategorySchema>;
export type Thread = v.InferOutput<typeof ThreadSchema>;
export type ThreadSummary = v.InferOutput<typeof ThreadSummarySchema>;
export type LatestMessage = v.InferOutput<typeof LatestMessageSchema>;
export type FileAttachment = v.InferOutput<typeof FileAttachmentSchema>;
export type Message = v.InferOutput<typeof MessageSchema>;
export type MessageHistory = v.InferOutput<typeof MessageHistorySchema>;
export type PollChoice = v.InferOutput<typeof PollChoiceSchema>;
export type PollInfo = v.InferOutput<typeof PollInfoSchema>;
