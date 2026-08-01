import type * as v from "valibot";

function safeJsonParse(json: string): unknown {
  try {
    const data: unknown = JSON.parse(json);
    return data;
  } catch {
    return undefined;
  }
}

function isUnknownRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getErrorCauseProperty(error: unknown, property: string): unknown {
  if (!(error instanceof Error)) return undefined;
  const { cause } = error;
  if (!isUnknownRecord(cause)) return undefined;
  return cause[property];
}

export async function handleResponseError(response: Response) {
  const responseIsJasonOnPs3 = response.headers
    .get("content-type")
    ?.includes("application/json");
  if (response.ok && (response.status === 204 || responseIsJasonOnPs3)) return;

  const responseText = await response.text().catch(() => "");
  const message =
    response.status === 401
      ? "Unauthorized"
      : `Failed to fetch data from server. Status: ${response.status}`;

  if (import.meta.env.DEV)
    console.error({
      message,
      responseText,
      responseJson: safeJsonParse(responseText),
      headers: response.headers,
      status: response.status,
    });

  throw new Error(message, {
    cause: { response, responseText },
  });
}

export async function handleResponseWithJason<TData>(
  response: Response,
  schema: v.GenericSchema<unknown, TData>,
) {
  await handleResponseError(response);
  const data: unknown =
    response.status === 204 ? undefined : await response.json();
  return parseSchema(schema, data);
}

export function getErrorResponse(error: unknown): Response | undefined {
  const response = getErrorCauseProperty(error, "response");
  return response instanceof Response ? response : undefined;
}

export function getResponseStatus(error: unknown): number | undefined {
  return getErrorResponse(error)?.status;
}

function getResponseBodyText(error: unknown): string | undefined {
  const responseText = getErrorCauseProperty(error, "responseText");
  return typeof responseText === "string" ? responseText : undefined;
}

export function getProblemDetail(error: unknown): string | undefined {
  const body = getResponseBodyText(error);
  if (!body) return undefined;
  try {
    const problem: unknown = JSON.parse(body);
    if (
      typeof problem !== "object" ||
      problem === null ||
      !("detail" in problem) ||
      typeof problem.detail !== "string"
    ) {
      return undefined;
    }
    const detail = problem.detail.replaceAll(/\s+/gu, " ").trim();
    return detail || undefined;
  } catch {
    return undefined;
  }
}
