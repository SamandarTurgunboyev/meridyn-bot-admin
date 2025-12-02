import type { DistrictListRes } from "@/features/districts/lib/data";
import httpClient from "@/shared/config/api/httpClient";
import { API_URLS } from "@/shared/config/api/URLs";
import type { AxiosResponse } from "axios";

export const discrit_api = {
  async list(params: {
    limit?: number;
    offset?: number;
    name?: string;
    user?: number;
  }): Promise<AxiosResponse<DistrictListRes>> {
    const res = await httpClient.get(`${API_URLS.DISTRICT}list/`, { params });
    return res;
  },

  async create(body: {
    name: string;
    user_id: number;
  }): Promise<AxiosResponse<DistrictListRes>> {
    const res = await httpClient.post(`${API_URLS.DISTRICT}create/`, body);
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
    const res = await httpClient.patch(
      `${API_URLS.DISTRICT}${id}/update/`,
      body,
    );
    return res;
  },

  async delete(id: number): Promise<AxiosResponse<DistrictListRes>> {
    const res = await httpClient.delete(`${API_URLS.DISTRICT}${id}/delete/`);
    return res;
  },
};
