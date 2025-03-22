import type React from "react";
import ForumThread from "../../../components/forum/boards/thread.component";
import { useParams } from "react-router";

const ForumThreadPage: React.FC = () => {
  const { threadId } = useParams();
  return (
    <>
      <ForumThread threadId={threadId!} />
    </>
  );
};

export default ForumThreadPage;
