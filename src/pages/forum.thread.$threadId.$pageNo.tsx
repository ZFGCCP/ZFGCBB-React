import type React from "react";
import ForumThread from "../components/forum/boards/thread.component";
import { useParams } from "react-router";

// FIXME: Move the ForumThread component into this file.
const ForumThreadPage: React.FC = () => {
  const { threadId, pageNo } = useParams();
  return (
    <>
      <ForumThread threadId={threadId!} pageNo={pageNo!} />
    </>
  );
};

export default ForumThreadPage;
