import type { PollInfo } from "../../../types/forum";

type PollAnswer = PollInfo["answers"][number];

function PollAnswerResult({ answer }: { answer: PollAnswer }) {
  const percent = answer.percentage ?? 0;
  const widthStyle = useMemo(
    () => ({ width: `${Math.min(percent, 100)}%` }),
    [percent],
  );

  return (
    <BBFlex direction="col" className="md:flex-row">
      <div className="md:w-sm lg:w-lg">
        {answer.seqno + 1}. {answer.choiceText}: {answer.votes}
      </div>
      <div className="flex items-center">
        <div className="mx-3 h-4 w-40 rounded-xs bg-muted">
          <div
            className="h-full rounded-xs bg-(--text-color-dimmed)"
            style={widthStyle}
          ></div>
        </div>
        {Math.trunc(percent)}%
      </div>
    </BBFlex>
  );
}

export default function PollResults({ poll }: { poll: PollInfo }) {
  const pollData = poll.answers.map((answer) => {
    return <PollAnswerResult key={answer.seqno} answer={answer} />;
  });

  return (
    <BBWidget className="p-5">
      <div className="mb-2">
        <b>Poll: {poll.pollQuestion}</b>
      </div>
      <div className="ms-2 mb-1">{pollData}</div>
    </BBWidget>
  );
}
