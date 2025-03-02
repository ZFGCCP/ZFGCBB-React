import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { BaseBB } from "../types/api";

export const useBBQuery = <T extends BaseBB | BaseBB[]>(
  url: string,
  retry: number = 0,
  gcTime: number = 300000,
  queryKey?: string,
) => {
  const bbKey = queryKey ? queryKey : url;

  return useQuery({
    queryKey: [bbKey],
    queryFn: async () => {
      const response = await axios.get<T>(
        `http://localhost:8080/zfgbb/${url}`,
      );
      const statusIs200 = response.status === 200;
      const responseIsJson =
        response.headers["content-type"] === "application/json";

      if (!statusIs200 || !responseIsJson)
        throw new Error("Failed to fetch data from server", {
          cause: {
            response,
            statusIs200,
            responseIsJson,
          },
        });

      const { data } = response;
      return data as T;
    },
    retry: retry,
    gcTime: gcTime
  });
};
