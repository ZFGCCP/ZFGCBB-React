import type { AccountDeletionPreview } from "@/schemas/user";

export type DeletionMode = "ANONYMIZE" | "PURGE";

export const DELETION_MODE_TITLES: Record<DeletionMode, string> = {
  ANONYMIZE: "Keep my posts, remove my name",
  PURGE: "Delete my posts and content",
};

function PreviewCounts({ entries }: { entries: Array<[string, number]> }) {
  return (
    <ul className="text-sm space-y-0.5">
      {entries.map(([label, count]) => (
        <li key={label}>
          <span className="font-bold">{count}</span> {label}
        </li>
      ))}
    </ul>
  );
}

function ExamplePost({ body }: { body: string }) {
  return (
    <div className="border border-default bg-default p-2 text-xs">
      <p className="font-bold text-dimmed">[deleted]</p>
      <p className="italic">{body}</p>
    </div>
  );
}

interface Props {
  preview?: AccountDeletionPreview | undefined;
  selectedMode?: DeletionMode | undefined;
  wipeAcknowledged: boolean;
  continueDisabled: boolean;
  onModeChange: (mode: DeletionMode) => void;
  onWipeAcknowledgedChange: (value: boolean) => void;
  onContinue: () => void;
}

export default function AccountDeletionChoice({
  preview,
  selectedMode,
  wipeAcknowledged,
  continueDisabled,
  onModeChange,
  onWipeAcknowledgedChange,
  onContinue,
}: Props) {
  const counts = (purge: boolean): Array<[string, number]> =>
    preview
      ? [
          ["forum posts", preview.messageCount],
          ["threads you started", preview.threadCount],
          ...(purge ? [["polls", preview.pollCount] as [string, number]] : []),
          ["wiki pages you created", preview.wikiPageCount],
          ["projects", preview.projectCount],
          ["resources", preview.resourceCount],
          ["uploads", preview.contentResourceCount],
        ]
      : [];
  const selectAnonymize = useCallback(() => {
    onModeChange("ANONYMIZE");
  }, [onModeChange]);
  const selectPurge = useCallback(() => {
    onModeChange("PURGE");
  }, [onModeChange]);
  const changeWipeAcknowledgement = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onWipeAcknowledgedChange(event.target.checked);
    },
    [onWipeAcknowledgedChange],
  );

  return (
    <div className="space-y-4">
      <p>
        Deleting your account is <span className="font-bold">permanent</span>.
        Choose what happens to the things you wrote. Nothing is deleted right
        away: we will email you a confirmation link first, and the deletion only
        happens once you open it.
      </p>
      {preview?.adminReplacementRequired && (
        <p className="text-sm border-l-2 border-error pl-2 text-error">
          Appoint another administrator first &mdash; the last one can&apos;t be
          deleted.
        </p>
      )}
      <fieldset className="space-y-3">
        <legend className="sr-only">What should happen to your content?</legend>
        <label
          className={`block border-2 p-3 cursor-pointer space-y-2 ${selectedMode === "ANONYMIZE" ? "border-inverted bg-elevated" : "border-default bg-muted"}`}
        >
          <span className="flex items-center gap-2 font-bold">
            <input
              type="radio"
              name="deletion-mode"
              checked={selectedMode === "ANONYMIZE"}
              onChange={selectAnonymize}
            />
            {DELETION_MODE_TITLES.ANONYMIZE}
          </span>
          <span className="block text-sm">
            Keep everything I wrote — posts, wiki edits, projects — shown as{" "}
            <span className="font-mono">[deleted]</span>; erase my identity,
            email, and personal info.
          </span>
          <span className="block text-sm text-dimmed">
            Discussions stay intact for everyone else.
          </span>
          {preview && (
            <span className="block text-sm">
              <span className="text-dimmed">Kept, with your name removed:</span>
              <PreviewCounts entries={counts(false)} />
            </span>
          )}
          <span className="block text-xs text-dimmed">
            How a kept post will look:
          </span>
          <ExamplePost body="The post text stays exactly as you wrote it — only the author becomes [deleted]." />
        </label>
        <label
          className={`block border-2 p-3 cursor-pointer space-y-2 ${selectedMode === "PURGE" ? "border-error bg-elevated" : "border-default bg-muted"}`}
        >
          <span className="flex items-center gap-2 font-bold text-error">
            <input
              type="radio"
              name="deletion-mode"
              checked={selectedMode === "PURGE"}
              onChange={selectPurge}
            />
            {DELETION_MODE_TITLES.PURGE}
          </span>
          <span className="block text-sm">
            Permanently delete my forum posts, threads and uploads,{" "}
            <span className="font-bold">
              wiki pages I created, and my projects and resources
            </span>
            . Pages I edited but didn&apos;t create are kept with my name shown
            as <span className="font-mono">[deleted]</span>. Private messages I
            sent stay in recipients&apos; inboxes with my name removed; quotes
            of me in other members&apos; posts remain.
          </span>
          <span className="block text-sm text-dimmed">
            Threads left empty by this deletion are removed for everyone,
            including members watching them.
          </span>
          {preview && (
            <span className="block text-sm">
              <span className="text-dimmed">Permanently deleted:</span>
              <PreviewCounts entries={counts(true)} />
            </span>
          )}
          <span className="block text-xs text-dimmed">
            What remains where your content is quoted or messaged:
          </span>
          <ExamplePost body="Private messages you sent and quotes of you in other members' posts remain, attributed to [deleted]." />
        </label>
      </fieldset>
      <p className="text-xs text-dimmed">
        In both cases, quotes of your posts inside other members&apos; messages
        are part of their posts and are not rewritten. You sent{" "}
        {preview ? preview.sentPersonalMessageCount : "your"} private messages;
        delivered copies stay with their recipients, with your name removed.
      </p>
      {selectedMode === "PURGE" && (
        <label className="flex items-start gap-2 text-sm border border-error p-2">
          <input
            type="checkbox"
            checked={wipeAcknowledged}
            onChange={changeWipeAcknowledgement}
          />
          <span>
            I understand this permanently deletes the wiki pages I created, my
            projects and resources, and my forum posts and uploads — for
            everyone, forever.
          </span>
        </label>
      )}
      <BBButton
        className={selectedMode === "PURGE" ? "border-error text-error" : ""}
        disabled={continueDisabled}
        onClick={onContinue}
      >
        Continue
      </BBButton>
    </div>
  );
}
