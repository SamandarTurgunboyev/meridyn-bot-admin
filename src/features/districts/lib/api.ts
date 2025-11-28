import type { DistrictListRes } from "@/features/districts/lib/data";
import httpClient from "@/shared/config/api/httpClient";
import { DISTRICT } from "@/shared/config/api/URLs";
import type { AxiosResponse } from "axios";

export const discrit_api = {
  async list(params: {
    limit?: number;
    offset?: number;
    name?: string;
  }): Promise<AxiosResponse<DistrictListRes>> {
    const res = await httpClient.get(`${DISTRICT}list/`, { params });
    return res;
  },

  async create(body: {
    name: string;
    user_id: number;
  }): Promise<AxiosResponse<DistrictListRes>> {
    const res = await httpClient.post(`${DISTRICT}create/`, body);
    return res;
  },

  async update({
    body,
    id,
  }: {
    id: number;
    body: {
      name: string;
      user: number;
    };
  }): Promise<AxiosResponse<DistrictListRes>> {
    const res = await httpClient.patch(`${DISTRICT}${id}/update/`, body);
    return res;
  },

  async delete(id: number): Promise<AxiosResponse<DistrictListRes>> {
    const res = await httpClient.delete(`${DISTRICT}${id}/delete/`);
    return res;
  },
};
