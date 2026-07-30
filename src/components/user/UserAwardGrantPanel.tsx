import { useState } from "react";

interface UserAwardGrantPanelProps {
  userId: number;
}

export default function UserAwardGrantPanel({
  userId,
}: UserAwardGrantPanelProps) {
  const catalog = useBBQuery("/user-profile/awards/catalog", {
    schema: AwardCatalogSchema,
  });
  const [selectedAwardId, setSelectedAwardId] = useState<number | null>(null);
  const [reason, setReason] = useState("");

  const grant = useBBMutation({
    schema: UserSchema,
    request: (variables: { awardId: number; reason: string }) => ({
      url: `/user-profile/${userId}/awards`,
      method: "POST",
      body: { awardId: variables.awardId, reason: variables.reason },
    }),
    invalidateKeys: [[`/user-profile/${userId}`]],
    onSuccess: () => setReason(""),
  });

  const awards = catalog.data ?? [];
  const activeAwardId = selectedAwardId ?? awards[0]?.awardId ?? null;
  const selectAward = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) =>
      setSelectedAwardId(Number(event.target.value)),
    [],
  );
  const changeReason = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setReason(event.target.value),
    [],
  );
  const grantAward = useCallback(() => {
    if (activeAwardId != null) {
      grant.mutate({ awardId: activeAwardId, reason });
    }
  }, [activeAwardId, grant, reason]);

  return (
    <BBAccordionWidget title="Grant Award">
      <div className="space-y-3">
        <select
          aria-label="Award"
          className="w-full p-2 bg-default border border-default"
          value={activeAwardId ?? ""}
          onChange={selectAward}
        >
          {awards.map((award) => (
            <option key={award.code} value={award.awardId}>
              {award.name}
            </option>
          ))}
        </select>
        <BBInput
          name="award-reason"
          value={reason}
          placeholder="Reason (optional)"
          onChange={changeReason}
        />
        <BBButton
          disabled={activeAwardId == null || grant.isPending}
          onClick={grantAward}
        >
          Grant Award
        </BBButton>
      </div>
    </BBAccordionWidget>
  );
}
