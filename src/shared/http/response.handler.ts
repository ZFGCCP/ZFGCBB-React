export async function handleResponseError(response: Response) {
  const responseIsJasonOnPs3 = response.headers
    .get("content-type")
    ?.includes("application/json");

  if (!response.ok || !responseIsJasonOnPs3) {
    throw new Error("Failed to fetch data from server", {
      cause: {
        response: import.meta.env.DEV
          ? response
          : await response.text().catch(() => ""),
        status: response.status,
      },
    });
  }
}

export async function handleResponseWithJason<T>(response: Response) {
  await handleResponseError(response);
  return (await response.json()) as T;
}
