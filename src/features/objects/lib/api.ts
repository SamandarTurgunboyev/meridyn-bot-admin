import type {
  ObjectCreate,
  ObjectListRes,
  ObjectUpdate,
} from "@/features/objects/lib/data";
import httpClient from "@/shared/config/api/httpClient";
import { API_URLS } from "@/shared/config/api/URLs";
import type { AxiosResponse } from "axios";

export const object_api = {
  async list(params: {
    limit?: number;
    offset?: number;
    name?: string;
    district?: string;
    user?: string;
  }): Promise<AxiosResponse<ObjectListRes>> {
    const res = await httpClient.get(`${API_URLS.OBJECT}list/`, { params });
    return res;
  },

  async create(body: ObjectCreate) {
    const res = await httpClient.post(`${API_URLS.OBJECT}create/`, body);
    return res;
  },

  async update({ body, id }: { id: number; body: ObjectUpdate }) {
    const res = await httpClient.patch(`${API_URLS.OBJECT}${id}/update/`, body);
    return res;
  },

  async delete(id: number) {
    const res = await httpClient.delete(`${API_URLS.OBJECT}${id}/delete/`);
    return res;
  },
};
