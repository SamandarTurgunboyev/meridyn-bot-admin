import type { FactoryCreate, FactoryListRes } from "@/features/pharm/lib/data";
import httpClient from "@/shared/config/api/httpClient";
import { API_URLS } from "@/shared/config/api/URLs";
import type { AxiosResponse } from "axios";

export const factory_api = {
  async list(params: {
    limit?: number;
    offset?: number;
    name?: string;
  }): Promise<AxiosResponse<FactoryListRes>> {
    const res = await httpClient.get(`${API_URLS.FACTORY}list/`, { params });
    return res;
  },

  async create(body: FactoryCreate) {
    const res = await httpClient.post(`${API_URLS.FACTORY}create/`, body);
    return res;
  },

  async update({ id, body }: { id: number; body: FactoryCreate }) {
    const res = await httpClient.patch(
      `${API_URLS.FACTORY}${id}/update/`,
      body,
    );
    return res;
  },

  async delete(id: number) {
    const res = await httpClient.delete(`${API_URLS.FACTORY}${id}/delete/`);
    return res;
  },
};
