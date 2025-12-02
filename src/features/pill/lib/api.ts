import type { PillCreateReq, PillListRes } from "@/features/pill/lib/data";
import httpClient from "@/shared/config/api/httpClient";
import { API_URLS } from "@/shared/config/api/URLs";
import type { AxiosResponse } from "axios";

export const pill_api = {
  async list(params: {
    limit?: number;
    offset?: number;
    name?: string;
  }): Promise<AxiosResponse<PillListRes>> {
    const res = await httpClient.get(`${API_URLS.PILL}list/`, { params });
    return res;
  },

  async added(body: PillCreateReq) {
    const res = httpClient.post(`${API_URLS.PILL}create/`, body);
    return res;
  },

  async update({ body, id }: { id: number; body: PillCreateReq }) {
    const res = httpClient.patch(`${API_URLS.PILL}${id}/update/`, body);
    return res;
  },

  async delete(id: number) {
    const res = httpClient.delete(`${API_URLS.PILL}${id}/delete/`);
    return res;
  },
};
