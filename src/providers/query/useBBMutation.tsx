import { useMutation } from "@tanstack/react-query";
import { BaseBB } from "../../types/api";
import axios from "axios";

export const useBBMutation = <T extends BaseBB, U extends BaseBB>(config: () => [string, T], onSuccess?: (data: U) => void) => {
    const mutator = useMutation({
        mutationFn: async () => {
            const [url, postBody] = config();
            const resp = axios.post<U>(`http://localhost:8080/zfgbb/${url}`, postBody);
            return (await resp).data;
        },
        onSuccess: onSuccess ? onSuccess : () => {},
        onError: () => {}
    });

    return mutator;
};