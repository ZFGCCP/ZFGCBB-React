export const useForumIndex = () => {
  return useBBQuery("/board/forum", { schema: ForumSchema });
};
