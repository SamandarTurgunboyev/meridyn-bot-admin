import type { LocationListRes } from "@/features/location/lib/data";
import httpClient from "@/shared/config/api/httpClient";
import { API_URLS } from "@/shared/config/api/URLs";
import type { AxiosResponse } from "axios";

export const location_api = {
  async list(params: {
    limit?: number;
    offset?: number;
    date?: string;
    user?: string;
  }): Promise<AxiosResponse<LocationListRes>> {
    const res = await httpClient.get(`${API_URLS.LOCATION}list/`, { params });
    return res;
  },

  async delete(id: number) {
    const res = await httpClient.delete(`${API_URLS.LOCATION}${id}/delete/`);
    return res;
  },

  async list_user_location(params: {
    limit?: number;
    offset?: number;
    date?: string;
    user?: string;
  }): Promise<AxiosResponse<LocationListRes>> {
    const res = await httpClient.get(`${API_URLS.USER_LOCATION}list/`, {
      params,
    });
    return res;
  },

  async list_user_location_delete(id: number) {
    const res = await httpClient.delete(
      `${API_URLS.USER_LOCATION}${id}/delete/`,
    );
    return res;
  },
};
