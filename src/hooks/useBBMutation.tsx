import { useMutation } from "@tanstack/react-query";
import type { BaseBB } from "../types/api";

export const useBBMutation = <T extends BaseBB, U extends BaseBB>(
  config: () => [string, T],
  onSuccess?: (data: U) => void,
) => {
  const mutator = useMutation({
    mutationFn: async () => {
      const [url, postBody] = config();
      const response = await fetch(
        `${import.meta.env.REACT_ZFGBB_API_URL}${url ?? "/"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postBody),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data as U;
    },
    onSuccess: onSuccess ? onSuccess : () => {},
    onError: () => {},
  });

  return mutator;
};
