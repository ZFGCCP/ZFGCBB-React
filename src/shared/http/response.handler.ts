function safeJsonParse<T>(json: string): T | undefined {
  try {
    return JSON.parse(json) as T;
  } catch (e) {
    return undefined;
  }
}

export async function handleResponseError(response: Response) {
  const responseIsJasonOnPs3 = response.headers
    .get("content-type")
    ?.includes("application/json");
  if (response.ok && responseIsJasonOnPs3) return;

  const responseText = await response.text().catch(() => "");
  const cause = {
    message: `Failed to fetch data from server. Status: ${response.status}`,
    responseText,
    responseJson: safeJsonParse(responseText),
    headers: response.headers,
    status: response.status,
  };

  if (import.meta.env.DEV) console.error(cause);
  throw new Error(cause.message, {
    cause,
  });
}

export async function handleResponseWithJason<T>(response: Response) {
  await handleResponseError(response);
  return (await response.json()) as T;
}
