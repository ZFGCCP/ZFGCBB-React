import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { BaseBB } from "../types/api";

export const useBBQuery = <T extends BaseBB | BaseBB[]>(
  url: `/${string}`,
  retry: number = 0,
  gcTime: number = 300000,
  queryKey?: string,
) => {
  const bbKey = queryKey ? queryKey : url;

  return useQuery({
    queryKey: [bbKey],
    queryFn: async () => {
      const response = await axios.get<T>(
        `${import.meta.env.REACT_ZFGBB_API_URL}${url ?? "/"}`,
      );
      const statusIs200 = response.status === 200;
      const responseIsJasonOnPs3 =
        response.headers["content-type"] === "application/json";

      if (!statusIs200 || !responseIsJasonOnPs3)
        throw new Error("Failed to fetch data from server", {
          cause: {
            response,
            statusIs200,
            responseIsJson: responseIsJasonOnPs3,
          },
        });

      const { data } = response;
      return data as T;
    },
    retry: retry,
    gcTime: gcTime,
  });
};
