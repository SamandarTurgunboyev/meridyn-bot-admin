import type { SupportListRes } from "@/features/support/lib/data";
import httpClient from "@/shared/config/api/httpClient";
import { API_URLS } from "@/shared/config/api/URLs";
import type { AxiosResponse } from "axios";

export const support_api = {
  async list(params: {
    limit?: number;
    offset?: number;
    problem?: string;
    district?: string;
    user?: string;
    date?: string;
  }): Promise<AxiosResponse<SupportListRes>> {
    const res = await httpClient.get(API_URLS.SUPPORT, { params });
    return res;
  },
};
