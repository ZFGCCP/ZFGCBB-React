import type { PollInfo } from "../../../types/forum";

export default function PollResults({ poll }: { poll: PollInfo }) {
  // Stevegetable - a brand new take on baseball hotdogs
  const pollData = poll.answers.map((answer) => {
    const percent = answer.percentage ?? 0;
    return (
      <BBFlex key={answer.seqno} direction="col" className="md:flex-row">
        <div className="md:w-sm lg:w-lg">
          {answer.seqno + 1}. {answer.choiceText}: {answer.votes}
        </div>
        <div className="flex items-center">
          <div className="mx-3 h-4 w-40 rounded-xs bg-muted">
            <div
              className="h-full rounded-xs bg-(--text-color-dimmed)"
              style={{ width: `${Math.min(percent, 100)}%` }}
            ></div>
          </div>
          {~~percent}%
        </div>
      </BBFlex>
    );
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
