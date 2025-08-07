import type React from "react";
import ForumThread from "../components/forum/boards/thread.component";
import { useLocation, useParams } from "react-router";

// FIXME: Move the ForumThread component into this file.
const ForumThreadPage: React.FC = () => {
  const { threadId, pageNo } = useParams();
  const route = useLocation();
  const board = route.state?.board;
  return (
    <>
      <ForumThread threadId={threadId!} pageNo={pageNo!} board={board} />
    </>
  );
};

export default ForumThreadPage;
