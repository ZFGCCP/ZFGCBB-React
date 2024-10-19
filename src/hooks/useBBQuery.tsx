import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { BaseBB } from "../types/api";

export const useBBQuery = <T extends BaseBB | BaseBB[]>(
  url: string,
  queryKey?: string,
  retry: number = 0,
) => {
  const bbKey = queryKey ? queryKey : url;
  const resp = useQuery({
    queryKey: [bbKey],
    queryFn: async () => {
      const response = await axios.get<T>(`http://localhost:8080/zfgbb/${url}`);
      const data = await response.data;
      return data;
    },
    retry: retry,
  });

  return resp.data;
};
