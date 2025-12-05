import type { DistributedList } from "@/features/distributed/lib/data";
import httpClient from "@/shared/config/api/httpClient";
import { API_URLS } from "@/shared/config/api/URLs";
import type { AxiosResponse } from "axios";

export const distributed_api = {
  async list(params: {
    limit?: number;
    offset?: number;
    product?: string;
    user?: string;
    date?: string;
  }): Promise<AxiosResponse<DistributedList>> {
    const res = await httpClient.get(API_URLS.DISTRIBUTED, { params });
    return res;
  },
};
