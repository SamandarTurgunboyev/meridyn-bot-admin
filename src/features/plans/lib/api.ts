import type {
  PlanCreateReq,
  PlanListRes,
  PlanUpdateReq,
} from "@/features/plans/lib/data";
import httpClient from "@/shared/config/api/httpClient";
import { API_URLS } from "@/shared/config/api/URLs";
import type { AxiosResponse } from "axios";

export const plans_api = {
  async list(params: {
    limit?: number;
    offset?: number;
    status?: boolean;
    date?: string;
    user?: string;
  }): Promise<AxiosResponse<PlanListRes>> {
    const res = await httpClient.get(`${API_URLS.PLANS}list/`, { params });
    return res;
  },

  async create(body: PlanCreateReq) {
    const res = await httpClient.post(`${API_URLS.PLANS}create/`, body);
    return res;
  },

  async update({ body, id }: { id: number; body: PlanUpdateReq }) {
    const res = await httpClient.patch(`${API_URLS.PLANS}${id}/update/`, body);
    return res;
  },

  async delete(id: number) {
    const res = await httpClient.delete(`${API_URLS.PLANS}${id}/delete/`);
    return res;
  },
};
