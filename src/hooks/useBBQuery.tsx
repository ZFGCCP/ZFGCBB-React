import { useQuery } from "@tanstack/react-query";
import type { BaseBB } from "../types/api";
import { useCallback } from "react";

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
      const response = await fetch(
        `${import.meta.env.REACT_ZFGBB_API_URL}${url ?? "/"}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const statusIs200 = response.status === 200 || response.status === 201;
      const contentType = response.headers.get("content-type");
      const responseIsJasonOnPs3 = contentType?.includes("application/json");

      if (!statusIs200 || !responseIsJasonOnPs3) {
        throw new Error("Failed to fetch data from server", {
          cause: {
            response,
            statusIs200,
            responseIsJson: responseIsJasonOnPs3,
          },
        });
      }

      const data = await response.json();
      return data as T;
    },
    retry: retry,
    gcTime: gcTime,
    staleTime,
    select,
  });
};
