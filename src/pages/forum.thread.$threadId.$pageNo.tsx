import type React from "react";
import ForumThread from "../components/forum/boards/thread.component";
import { useParams } from "react-router";

const ForumThreadPage: React.FC = () => {
  const { threadId, pageNo } = useParams();
  return (
    <>
      <ForumThread threadId={threadId!} pageNo={pageNo!} />
    </>
  );
};

export default ForumThreadPage;
