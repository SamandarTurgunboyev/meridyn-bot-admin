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

  async create(body: { name: string }) {
    const res = await httpClient.post(`${REGIONS}create/`, body);
    return res;
  },

  async update({ body, id }: { id: number; body: { name: string } }) {
    const res = await httpClient.patch(`${REGIONS}${id}/update/`, body);
    return res;
  },

  async delete(id: number) {
    const res = await httpClient.delete(`${REGIONS}${id}/delete/`);
    return res;
  },
};
