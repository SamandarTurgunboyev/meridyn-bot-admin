import type { RegionListRes } from "@/features/region/lib/data";
import httpClient from "@/shared/config/api/httpClient";
import { REGIONS } from "@/shared/config/api/URLs";
import type { AxiosResponse } from "axios";

export const region_api = {
  async list(params: {
    limit?: number;
    offset?: number;
    name?: string;
  }): Promise<AxiosResponse<RegionListRes>> {
    return await httpClient.get(`${REGIONS}list/`, { params });
  },
};
