import type {
  PlanTourCreate,
  PlanTourListRes,
  PlanTourUpdate,
} from "@/features/tour-plan/lib/data";
import httpClient from "@/shared/config/api/httpClient";
import { API_URLS } from "@/shared/config/api/URLs";
import type { AxiosResponse } from "axios";

export const tour_plan_api = {
  async list(params: {
    limit?: number;
    offset?: number;
    name?: string;
    date?: string;
    user?: string;
  }): Promise<AxiosResponse<PlanTourListRes>> {
    const res = await httpClient.get(`${API_URLS.TOUR_PLAN}list/`, { params });
    return res;
  },

  async create(body: PlanTourCreate) {
    const res = await httpClient.post(`${API_URLS.TOUR_PLAN}create/`, body);
    return res;
  },

  async update({ body, id }: { id: number; body: PlanTourUpdate }) {
    const res = await httpClient.patch(
      `${API_URLS.TOUR_PLAN}${id}/update/`,
      body,
    );
    return res;
  },

  async delete(id: number) {
    const res = await httpClient.delete(`${API_URLS.TOUR_PLAN}${id}/delete/`);
    return res;
  },
};
