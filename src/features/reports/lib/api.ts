import type { ResportListRes } from "@/features/reports/lib/data";
import httpClient from "@/shared/config/api/httpClient";
import { API_URLS } from "@/shared/config/api/URLs";
import type { AxiosResponse } from "axios";

export const report_api = {
  async list(params: {
    limit: number;
    offset: number;
  }): Promise<AxiosResponse<ResportListRes>> {
    const res = await httpClient.get(`${API_URLS.REPORT}list/`, { params });
    return res;
  },
};
