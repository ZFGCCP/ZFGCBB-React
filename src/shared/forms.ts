export function firstError(errors: unknown[]): string | undefined {
  for (const error of errors) {
    if (!error) continue;
    if (typeof error === "string") return error;
    if (typeof error === "object" && error !== null && "message" in error) {
      const { message } = error;
      if (typeof message === "string") return message;
    }
  }
  return undefined;
}
