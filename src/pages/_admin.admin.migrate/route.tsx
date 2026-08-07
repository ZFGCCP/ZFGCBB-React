import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import * as v from "valibot";
import { WikiNamespaceManagement } from "./WikiNamespaceManagement";
import BBToggle from "@/components/common/forms/BBToggle";
import { UserContext } from "@/providers/user/userProvider";
import {
  SmfMemberGroupListSchema,
  PermissionCodeListSchema,
  type ConflictCandidate,
  type MigrationConflict,
  type SmfMemberGroup,
} from "@/schemas/system";

const EMPTY_PERMISSION_CODES: { permissionCode: string }[] = [];

function stateClass(state: Job["state"]): string {
  switch (state) {
    case "RUNNING":
      return "text-highlighted font-semibold";
    case "COMPLETED":
      return "text-highlighted";
    case "FAILED":
      return "text-error font-semibold";
    case "CANCELLED":
      return "text-dimmed";
    case "QUEUED":
      return "text-muted";
    default:
      return "text-muted";
  }
}

function JobRow({
  job,
  onCancelSuccess,
}: {
  job: Job;
  onCancelSuccess: () => void;
}) {
  const cancelMutation = useBBMutation({
    request: () => ({
      url: `/admin/migrate/jobs/${job.id}`,
      method: "DELETE",
    }),
    schema: v.undefined(),
    onSuccess: onCancelSuccess,
  });
  const cancel = useCallback(() => {
    cancelMutation.mutate();
  }, [cancelMutation]);

  const canCancel = job.state === "QUEUED" || job.state === "RUNNING";

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 p-2 border-b border-default text-sm">
      <span className="w-52 truncate font-mono">{job.type}</span>
      <span className={`w-24 ${stateClass(job.state)}`}>{job.state}</span>
      <span className="w-40 text-dimmed">
        <BBDate dateStr={job.submittedAt} />
      </span>
      <span className="w-40 text-dimmed">
        <BBDate dateStr={job.startedAt} />
      </span>
      <span className="w-40 text-dimmed">
        <BBDate dateStr={job.finishedAt} />
      </span>
      {job.error && (
        <span className="flex-1 text-error truncate" title={job.error}>
          {job.error}
        </span>
      )}
      {canCancel && (
        <button
          type="button"
          className="ml-auto px-2 py-1 border border-default text-sm"
          disabled={cancelMutation.isPending}
          onClick={cancel}
        >
          {cancelMutation.isPending ? "Cancelling..." : "Cancel"}
        </button>
      )}
    </div>
  );
}

const JOB_TYPE_OPTIONS = JOB_TYPES.map((type) => ({
  value: type,
  label: type,
}));

const DEFAULT_MIGRATE_JOB_FORM: MigrateJobForm = {
  type: "MIGRATE_SMF_INSTALLATION",
  smfHost: "",
  smfPort: "3306",
  smfDatabase: "",
  smfUser: "",
  smfPassword: "",
  smfTablePrefix: "",
  smfLegacyHost: "",
  attachmentsSourcePath: "",
  attachmentsTargetPath: "",
  cmsFilesSourcePath: "",
  wikiImagesSourcePath: "",
  force: false,
};

function ConflictCandidateButton({
  candidate,
  conflictId,
  disabled,
  onResolve,
}: {
  candidate: ConflictCandidate;
  conflictId: number;
  disabled: boolean;
  onResolve: (variables: { id: number; sourceType: string }) => void;
}) {
  const resolve = useCallback(() => {
    onResolve({
      id: conflictId,
      sourceType: candidate.sourceType,
    });
  }, [candidate.sourceType, conflictId, onResolve]);

  return (
    <BBButton title={candidate.label} disabled={disabled} onClick={resolve}>
      <span className="text-[10px] font-bold tracking-widest text-dimmed">
        {candidate.sourceType}
      </span>
      <span className="ml-1.5 text-default">{candidate.value}</span>
    </BBButton>
  );
}

function ConflictRow({
  conflict,
  resolving,
  onDismiss,
  onResolve,
}: {
  conflict: MigrationConflict;
  resolving: boolean;
  onDismiss: (id: number) => void;
  onResolve: (variables: { id: number; sourceType: string }) => void;
}) {
  const dismiss = useCallback(() => {
    onDismiss(conflict.id);
  }, [conflict.id, onDismiss]);

  return (
    <BBPanel as="li" className="p-2.5">
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="font-bold text-highlighted">
          {conflict.entityLabel ??
            `${conflict.entityType} ${conflict.entityId}`}
        </span>
        <span className="text-xs text-dimmed">
          · conflicting {conflict.fieldName.replaceAll("_", " ")} — pick the
          source to keep:
        </span>
        <button
          type="button"
          onClick={dismiss}
          className="ml-auto text-xs text-dimmed hover:text-highlighted cursor-pointer"
        >
          dismiss
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {conflict.candidates.map((candidate) => (
          <ConflictCandidateButton
            key={candidate.sourceRef}
            candidate={candidate}
            conflictId={conflict.id}
            disabled={resolving}
            onResolve={onResolve}
          />
        ))}
      </div>
    </BBPanel>
  );
}

function ConflictsPanel() {
  const { data: conflicts, refetch } = useBBQuery(
    "/admin/migrate/conflicts?status=OPEN",
    {
      retry: 0,
      gcTime: 0,
      staleTime: 0,
      queryKey: "migrate-conflicts",
      schema: MigrationConflictListSchema,
    },
  );

  const scan = useBBMutation({
    request: () => ({ url: "/admin/migrate/conflicts/scan" }),
    schema: MigrateDetectResponseSchema,
    onSuccess: () => refetch(),
  });

  const resolve = useMutation<
    unknown,
    Error,
    { id: number; sourceType: string }
  >({
    mutationFn: async ({ id, sourceType }) => {
      const response = await apiFetch(
        `${getApiBaseUrl()}/system/migrate/conflicts/${id}/resolve`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sourceType }),
        },
      );
      return handleResponseWithJason(response, v.unknown());
    },
    onSuccess: () => refetch(),
  });

  const dismiss = useMutation<unknown, Error, number>({
    mutationFn: async (id) => {
      const response = await apiFetch(
        `${getApiBaseUrl()}/system/migrate/conflicts/${id}/dismiss`,
        { method: "POST", credentials: "include" },
      );
      return handleResponseWithJason(response, v.unknown());
    },
    onSuccess: () => refetch(),
  });
  const scanForConflicts = useCallback(() => {
    scan.mutate();
  }, [scan]);
  const dismissConflict = useCallback(
    (id: number) => {
      dismiss.mutate(id);
    },
    [dismiss],
  );
  const resolveConflict = useCallback(
    (variables: { id: number; sourceType: string }) => {
      resolve.mutate(variables);
    },
    [resolve],
  );

  return (
    <BBWidget widgetTitle="Data Conflicts">
      <div className="space-y-3 p-3">
        <div className="flex flex-wrap items-center gap-3">
          <BBButton onClick={scanForConflicts} disabled={scan.isPending}>
            {scan.isPending ? "Scanning…" : "Scan for conflicts"}
          </BBButton>
          {scan.data && (
            <span className="text-sm text-dimmed">
              Detected {scan.data.detected} conflict(s).
            </span>
          )}
          <span className="ml-auto text-sm text-dimmed">
            {conflicts?.length ?? 0} open
          </span>
        </div>
        {!conflicts || conflicts.length === 0 ? (
          <p className="text-sm text-dimmed">
            No open conflicts. Run a scan to detect disagreements between a
            record&apos;s sources.
          </p>
        ) : (
          <ul className="space-y-2">
            {conflicts.map((conflict) => (
              <ConflictRow
                key={conflict.id}
                conflict={conflict}
                resolving={resolve.isPending}
                onDismiss={dismissConflict}
                onResolve={resolveConflict}
              />
            ))}
          </ul>
        )}
      </div>
    </BBWidget>
  );
}

function SmfConnectionFields({
  uploadResult,
  isUploading,
  uploadError,
  onUpload,
}: {
  uploadResult: MigrateUploadResponse | null;
  isUploading: boolean;
  uploadError: Error | null;
  onUpload: (file: File) => void;
}) {
  const upload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) onUpload(file);
    },
    [onUpload],
  );

  return (
    <BBWidget widgetTitle="SMF Database Connection">
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <BBField label="Host" name="smfHost" placeholder="localhost" />
          <BBField label="Port" name="smfPort" type="number" />
          <BBField label="Database" name="smfDatabase" />
          <BBField label="Username" name="smfUser" />
          <BBField label="Password" name="smfPassword" type="password" />
          <BBField
            label="Table prefix"
            name="smfTablePrefix"
            placeholder="smf_"
            helperText="Whatever prefix you chose during SMF install. Defaults to smf_ if blank."
          />
          <BBField
            label="Legacy host"
            name="smfLegacyHost"
            placeholder="zfgc.com"
            helperText="The host that appears in URLs inside SMF post bodies (e.g. localhost:8090 for a local install). zfgc.com is always rewritten; this adds an additional host."
          />
        </div>
        <div className="space-y-3 pt-2 border-t border-default">
          <p className="text-xs text-dimmed">
            Upload a zip containing{" "}
            <code className="text-highlighted">attachments/</code> and/or{" "}
            <code className="text-highlighted">avatars/</code> directories.
            Leave empty to skip attachment migration.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept=".zip"
              aria-label="Upload migration zip"
              className="text-sm"
              disabled={isUploading}
              onChange={upload}
            />
            {isUploading && (
              <span className="text-sm text-dimmed">Uploading...</span>
            )}
          </div>
          {uploadResult && (
            <div className="text-xs space-y-1 bg-default p-2 rounded border border-default">
              <p>
                Attachments:{" "}
                <span className="text-highlighted">
                  {uploadResult.attachmentsSourcePath ?? "not found in zip"}
                </span>
              </p>
              <p>
                Avatars:{" "}
                <span className="text-highlighted">
                  {uploadResult.avatarsSourcePath ?? "not found in zip"}
                </span>
              </p>
            </div>
          )}
          {uploadError && (
            <p className="text-sm text-error">
              Upload failed: {uploadError.message}
            </p>
          )}
          <BBField
            label="Attachments target path"
            name="attachmentsTargetPath"
            placeholder="/path/to/zfgbb/attachments"
            helperText="Server path where migrated files are written. Required if a zip was uploaded."
          />
          <BBField
            label="Attachments source path (manual override)"
            name="attachmentsSourcePath"
            placeholder="/path/to/smf/attachments"
            helperText="Only needed if not using zip upload. Overrides the zip's extracted path."
          />
          <BBField
            label="CMS files source path"
            name="cmsFilesSourcePath"
            placeholder="/path/to/public_html/files"
            helperText="The old CodeIgniter files/ directory (projects, projects/gallery, projects/downloads, resources). Needed for the CMS migration jobs; leave empty to skip project/resource assets."
          />
          <BBField
            label="Wiki images source path"
            name="wikiImagesSourcePath"
            placeholder="/path/to/wiki/images"
            helperText="The MediaWiki images/ directory (hashed layout). Leave empty to skip wiki image migration."
          />
        </div>
      </div>
    </BBWidget>
  );
}

function GroupPermissionMapping({
  isLoading,
  loadError,
  onLoad,
  smfGroups,
  permissionCodes,
  groupPermissionMap,
  onToggle,
}: {
  isLoading: boolean;
  loadError: Error | null;
  onLoad: () => void;
  smfGroups: SmfMemberGroup[] | null;
  permissionCodes: { permissionCode: string }[];
  groupPermissionMap: Record<number, string[]>;
  onToggle: (groupId: number, code: string, checked: boolean) => void;
}) {
  return (
    <BBWidget
      widgetTitle={
        <>
          Group <Fa6SolidArrowRight aria-hidden className="inline" /> Permission
          Mapping
        </>
      }
    >
      <div className="p-4 space-y-3">
        <p className="text-xs text-dimmed">
          Optional. Load your SMF membergroups and choose which ZFGBB permission
          codes each maps to. Unmapped groups fall back to the built-in
          defaults.
        </p>
        <BBButton type="button" disabled={isLoading} onClick={onLoad}>
          {isLoading ? "Loading..." : "Load groups from SMF"}
        </BBButton>
        {loadError && <p className="text-xs text-error">{loadError.message}</p>}
        {smfGroups && smfGroups.length > 0 && (
          <div className="space-y-2">
            {smfGroups.map((group) => {
              const assignedPermissions = new Set(
                groupPermissionMap[group.id] ?? [],
              );
              return (
                <BBPanel key={group.id} className="p-2.5 space-y-1.5">
                  <p className="text-sm font-bold">
                    {group.name}{" "}
                    <span className="text-dimmed">#{group.id}</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {permissionCodes.map((permission) => {
                      const checked = assignedPermissions.has(
                        permission.permissionCode,
                      );
                      return (
                        <GroupPermissionToggle
                          key={permission.permissionCode}
                          groupId={group.id}
                          code={permission.permissionCode}
                          checked={checked}
                          onToggle={onToggle}
                        />
                      );
                    })}
                  </div>
                </BBPanel>
              );
            })}
          </div>
        )}
      </div>
    </BBWidget>
  );
}

function GroupPermissionToggle({
  groupId,
  code,
  checked,
  onToggle,
}: {
  groupId: number;
  code: string;
  checked: boolean;
  onToggle: (groupId: number, code: string, checked: boolean) => void;
}) {
  const toggle = useCallback(
    (nextChecked: boolean) => {
      onToggle(groupId, code, nextChecked);
    },
    [code, groupId, onToggle],
  );

  return (
    <BBToggle checked={checked} onCheckedChange={toggle}>
      {code}
    </BBToggle>
  );
}

function MigrationJobsList({
  jobs,
  onRefetch,
}: {
  jobs: Job[] | undefined;
  onRefetch: () => void;
}) {
  return (
    <BBWidget widgetTitle="Jobs">
      {!jobs || jobs.length === 0 ? (
        <p className="p-4 text-dimmed">No jobs found.</p>
      ) : (
        <div>
          <div className="flex flex-wrap gap-x-4 p-2 border-b-2 border-default text-sm font-semibold">
            <span className="w-52">Type</span>
            <span className="w-24">State</span>
            <span className="w-40">Submitted</span>
            <span className="w-40">Started</span>
            <span className="w-40">Finished</span>
          </div>
          {jobs.map((job) => (
            <JobRow key={job.id} job={job} onCancelSuccess={onRefetch} />
          ))}
        </div>
      )}
    </BBWidget>
  );
}

export const handle = {
  breadcrumb: "SMF Import",
} satisfies BreadcrumbHandle;

export default function AdminMigratePage() {
  const user = useContext(UserContext);
  const isSiteAdmin = user.permissions?.some(
    (permission) => permission.permissionCode === "ZFGC_SITE_ADMIN",
  );

  const [uploadResult, setUploadResult] =
    useState<MigrateUploadResponse | null>(null);
  const [smfGroups, setSmfGroups] = useState<SmfMemberGroup[] | null>(null);
  const [groupPermissionMap, setGroupPermissionMap] = useState<
    Record<number, string[]>
  >({});
  const queryClient = useQueryClient();

  const { data: permissionCodes } = useBBQuery(
    "/admin/migrate/permission-codes",
    {
      schema: PermissionCodeListSchema,
      enabled: isSiteAdmin ?? false,
      queryKey: "migrate-permission-codes",
    },
  );

  const { data: jobs, refetch } = useBBQuery("/admin/migrate/jobs", {
    retry: 0,
    gcTime: 0,
    staleTime: 0,
    queryKey: "migrate-jobs",
    refetchInterval: (query) =>
      query.state.data?.some(
        (job) => job.state === "QUEUED" || job.state === "RUNNING",
      )
        ? 2000
        : false,
    enabled: isSiteAdmin ?? false,
    schema: JobListSchema,
  });

  const uploadMutation = useMutation<MigrateUploadResponse, Error, File>({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiFetch(
        `${getApiBaseUrl()}/system/migrate/upload`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );
      return handleResponseWithJason(response, MigrateUploadResponseSchema);
    },
    onSuccess: (data) => {
      setUploadResult(data);
      void queryClient.invalidateQueries({ queryKey: ["migrate-jobs"] });
    },
  });

  const startJobMutation = useMutation<unknown, Error, MigrateJobRequest>({
    mutationFn: async (body) => {
      const response = await apiFetch(
        `${getApiBaseUrl()}/system/migrate/jobs`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      return handleResponseWithJason(response, v.unknown());
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["migrate-jobs"] });
    },
  });

  const form = useForm({
    defaultValues: DEFAULT_MIGRATE_JOB_FORM,
    validators: {
      onBlur: MigrateJobFormSchema,
      onSubmit: MigrateJobFormSchema,
    },
    onSubmit: async ({ value }) => {
      const populatedGroupPermissionMap = Object.fromEntries(
        Object.entries(groupPermissionMap).filter(
          ([, codes]) => codes.length > 0,
        ),
      );
      const body: MigrateJobRequest = {
        type: value.type,
        smfHost: value.smfHost,
        smfPort: Number(value.smfPort),
        smfDatabase: value.smfDatabase,
        smfUser: value.smfUser,
        smfPassword: value.smfPassword,
        smfTablePrefix: value.smfTablePrefix || undefined,
        smfLegacyHost: value.smfLegacyHost || undefined,
        attachmentsSourcePath:
          uploadResult?.attachmentsSourcePath ??
          value.attachmentsSourcePath ??
          undefined,
        attachmentsTargetPath: value.attachmentsTargetPath || undefined,
        avatarsSourcePath: uploadResult?.avatarsSourcePath ?? undefined,
        cmsFilesSourcePath: value.cmsFilesSourcePath || undefined,
        wikiImagesSourcePath: value.wikiImagesSourcePath || undefined,
        force: value.force || undefined,
        groupPermissionMap:
          Object.keys(populatedGroupPermissionMap).length > 0
            ? populatedGroupPermissionMap
            : undefined,
      };
      await startJobMutation.mutateAsync(body);
    },
  });

  const loadGroupsMutation = useBBMutation({
    schema: SmfMemberGroupListSchema,
    request: () => ({
      url: "/admin/migrate/membergroups",
      method: "POST",
      body: {
        smfHost: form.state.values.smfHost,
        smfPort: Number(form.state.values.smfPort),
        smfDatabase: form.state.values.smfDatabase,
        smfUser: form.state.values.smfUser,
        smfPassword: form.state.values.smfPassword,
        smfTablePrefix: form.state.values.smfTablePrefix || undefined,
      },
    }),
    onSuccess: (groups) => {
      setSmfGroups(groups);
      setGroupPermissionMap(
        Object.fromEntries(
          groups.map((group) => [group.id, group.suggestedCodes]),
        ),
      );
    },
  });
  const uploadArchive = useCallback(
    (file: File) => {
      uploadMutation.mutate(file);
    },
    [uploadMutation],
  );
  const loadGroups = useCallback(() => {
    loadGroupsMutation.mutate();
  }, [loadGroupsMutation]);
  const togglePermission = useCallback(
    (groupId: number, code: string, checked: boolean) => {
      setGroupPermissionMap((previous) => {
        const current = previous[groupId] ?? [];
        const next = checked
          ? [...current, code]
          : current.filter((existing) => existing !== code);
        return { ...previous, [groupId]: next };
      });
    },
    [],
  );
  const refreshJobs = useCallback(() => {
    void refetch();
  }, [refetch]);

  if (!isSiteAdmin) {
    return (
      <BBWidget widgetTitle="Migration">
        <div className="p-4">
          <p>You do not have permission to access this page.</p>
        </div>
      </BBWidget>
    );
  }

  return (
    <div className="space-y-4">
      <BBForm
        form={form}
        className="space-y-4"
        errorMessage={
          startJobMutation.isError ? startJobMutation.error.message : null
        }
      >
        <SmfConnectionFields
          uploadResult={uploadResult}
          isUploading={uploadMutation.isPending}
          uploadError={uploadMutation.error}
          onUpload={uploadArchive}
        />

        <GroupPermissionMapping
          isLoading={loadGroupsMutation.isPending}
          loadError={loadGroupsMutation.error}
          onLoad={loadGroups}
          smfGroups={smfGroups}
          permissionCodes={permissionCodes ?? EMPTY_PERMISSION_CODES}
          groupPermissionMap={groupPermissionMap}
          onToggle={togglePermission}
        />

        <WikiNamespaceManagement />

        <BBWidget widgetTitle="Start Migration Job">
          <div className="p-4 space-y-3">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <BBSelectField
                  name="type"
                  label="Job type"
                  options={JOB_TYPE_OPTIONS}
                />
              </div>
              <BBSubmit
                pendingChildren="Starting..."
                className="px-4 py-2 bg-accented border border-default disabled:opacity-50"
              >
                Start
              </BBSubmit>
            </div>
            <BBCheckboxField
              name="force"
              label="Force re-migration"
              helperText="Re-update rows even when migration_hash hasn't changed — for re-runs after changing the legacy host or table prefix."
            />
          </div>
        </BBWidget>
      </BBForm>

      <MigrationJobsList jobs={jobs} onRefetch={refreshJobs} />

      <ConflictsPanel />
    </div>
  );
}
