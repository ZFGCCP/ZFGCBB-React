import { useQuery } from "@tanstack/react-query";
import type { BaseBB } from "../types/api";
import { useCallback } from "react";
import { handleResponseWithJason } from "@/shared/http/response.handler";

export const useBBQuery = <T extends BaseBB | BaseBB[]>(
  url: `/${string}`,
  retry: number = 0,
  gcTime: number = 300000,
  staleTime: number = 100000,
  queryKey?: string,
) => {
  const bbKey = queryKey ? queryKey : url;
  const select = useCallback((data?: T) => data as T, []);

  return useQuery({
    queryKey: [bbKey],
    queryFn: async () => {
      return await handleResponseWithJason<T>(
        await fetch(`${import.meta.env.REACT_ZFGBB_API_URL}${url ?? "/"}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );
    },
    retry: retry,
    gcTime: gcTime,
    staleTime,
    select,
  });
};
