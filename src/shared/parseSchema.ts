import * as v from "valibot";

export class SchemaValidationError extends Error {
  readonly issues: [v.BaseIssue<unknown>, ...v.BaseIssue<unknown>[]];
  constructor(issues: [v.BaseIssue<unknown>, ...v.BaseIssue<unknown>[]]) {
    super("The server response did not match the expected schema.");
    this.name = "SchemaValidationError";
    this.issues = issues;
  }
}

export function parseSchema<TData>(
  schema: v.GenericSchema<unknown, TData>,
  data: unknown,
): TData {
  const result = v.safeParse(schema, data);
  if (result.success) return result.output;

  if (import.meta.env.DEV) {
    console.error("Schema validation failed");
    console.dir(v.flatten(result.issues), { depth: null });
  }

  throw new SchemaValidationError(result.issues);
}
