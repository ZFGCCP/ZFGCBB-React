import type * as v from "valibot";

const DETAIL_SAFE_STATUSES = new Set([400, 409, 422]);
const MAXIMUM_DETAIL_LENGTH = 240;

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

function problemDetail(responseText: string | undefined): string | undefined {
  if (!responseText) return undefined;
  const problem = safeJsonParse(responseText);
  if (!isUnknownRecord(problem) || typeof problem.detail !== "string") {
    return undefined;
  }
  const detail = problem.detail.replaceAll(/\s+/gu, " ").trim();
  return detail || undefined;
}

function safeDetail(
  status: number | undefined,
  responseText: string | undefined,
): string | undefined {
  if (status === undefined || !DETAIL_SAFE_STATUSES.has(status))
    return undefined;
  const detail = problemDetail(responseText);
  if (!detail) return undefined;
  return detail.length > MAXIMUM_DETAIL_LENGTH
    ? `${detail.slice(0, MAXIMUM_DETAIL_LENGTH - 3)}...`
    : detail;
}

function statusMessage(status: number): string {
  if (status === 401)
    return "You are signed out, or your session expired. Sign in and try again.";
  if (status === 403) return "You do not have permission to do that.";
  if (status === 404) return "That could not be found.";
  if (status === 409)
    return "Someone else changed this first. Reload the page and try again.";
  if (status === 413) return "That upload is too large.";
  if (status === 429)
    return "That happened too many times in a row. Wait a moment and try again.";
  if (status >= 500) return "The server ran into a problem. Try again shortly.";
  if (status >= 400)
    return "That request could not be completed. Check the details and try again.";
  return "The server sent back something unexpected. Try again.";
}

export async function handleResponseError(response: Response) {
  const responseIsJasonOnPs3 = response.headers
    .get("content-type")
    ?.includes("application/json");
  if (response.ok && (response.status === 204 || responseIsJasonOnPs3)) return;

  const responseText = await response.text().catch(() => "");
  const developerMessage = `Failed to fetch data from server. Status: ${response.status}`;
  const message =
    safeDetail(response.status, responseText) ?? statusMessage(response.status);

  if (import.meta.env.DEV)
    console.error({
      message: developerMessage,
      responseText,
      responseJson: safeJsonParse(responseText),
      headers: response.headers,
      status: response.status,
    });

  throw new Error(message, {
    cause: { response, responseText, developerMessage },
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
  return problemDetail(getResponseBodyText(error));
}

export function withSafeDetail(message: string, error: unknown): string {
  const detail = safeDetail(
    getResponseStatus(error),
    getResponseBodyText(error),
  );
  return detail ? `${message} ${detail}` : message;
}
