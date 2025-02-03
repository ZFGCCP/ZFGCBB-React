import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { BaseBB } from "../../types/api";

export const useBBMutation = <T extends BaseBB, U extends BaseBB>(
  config: () => [string, T],
  onSuccess?: (data: U) => void,
) => {
  const mutator = useMutation({
    mutationFn: async () => {
      const [url, postBody] = config();
      const resp = axios.post<U>(
        `${import.meta.env.REACT_ZFGBB_API_URL}${url}`,
        postBody,
      );
      return (await resp).data;
    },
    onSuccess: onSuccess ? onSuccess : () => {},
    onError: () => {},
  });

  return mutator;
};
