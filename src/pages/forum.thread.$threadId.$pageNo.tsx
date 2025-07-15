import type React from "react";
import ForumThread from "../components/forum/boards/thread.component";
import { useLocation, useParams } from "react-router";

// FIXME: Move the ForumThread component into this file.
const ForumThreadPage: React.FC = () => {
  const { threadId, pageNo } = useParams();
  const route = useLocation();
  const boardName = route.state?.board?.boardName ?? "";
  return (
    <>
      <ForumThread
        threadId={threadId!}
        pageNo={pageNo!}
        boardName={boardName}
      />
    </>
  );
};

export default ForumThreadPage;
