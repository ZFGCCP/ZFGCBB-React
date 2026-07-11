import * as v from "valibot";

function safeJsonParse<TValue>(json: string): TValue | undefined {
  try {
    return JSON.parse(json) as TValue;
  } catch {
    return;
  }
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
  schema?: v.GenericSchema<unknown, TData>,
) {
  if (response.status === 204) return undefined as TData;
  await handleResponseError(response);
  const data = await response.json();
  return parseSchema(schema, data);
}

export function getResponseStatus(error: unknown): number | undefined {
  if (!(error instanceof Error)) return undefined;
  const cause = error.cause as { response?: Response } | undefined;
  return cause?.response?.status;
}

export function getResponseBodyText(error: unknown): string | undefined {
  if (!(error instanceof Error)) return undefined;
  const cause = error.cause as { responseText?: string } | undefined;
  return cause?.responseText;
}
