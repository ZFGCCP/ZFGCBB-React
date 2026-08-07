import type * as v from "valibot";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";

export type CmsConfig = v.InferOutput<typeof CmsConfigSchema>;

export function CmsSettings({ config }: { config: CmsConfig }) {
  const queryClient = useQueryClient();

  const configMutation = useBBMutation({
    request: (discussionBoardId: string) => ({
      url: "/admin/cms/config",
      method: "PUT",
      body: { discussionBoardId },
    }),
    schema: CmsConfigSchema,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["/admin/cms/config"],
      });
    },
  });

  const form = useForm({
    defaultValues: {
      discussionBoardId: config.discussionBoardId ?? "",
    },
    validators: {
      onBlur: CmsConfigFormSchema,
      onSubmit: CmsConfigFormSchema,
    },
    onSubmit: async ({ value }) => {
      await configMutation.mutateAsync(value.discussionBoardId);
    },
  });

  return (
    <BBWidget widgetTitle="CMS Settings">
      <BBForm
        form={form}
        className="p-4 space-y-3"
        errorMessage={
          configMutation.isError ? configMutation.error.message : null
        }
      >
        <div className="flex items-end gap-3">
          <div className="w-40">
            <BBField
              label="Discussion board id"
              name="discussionBoardId"
              type="number"
            />
          </div>
          <BBSubmit
            pendingChildren="Saving..."
            className="px-4 py-2 bg-accented border border-default disabled:opacity-50"
          >
            Save
          </BBSubmit>
          <p className="text-xs text-dimmed grow">
            New project/resource discussions are created as threads in this
            board.
          </p>
        </div>
      </BBForm>
    </BBWidget>
  );
}
