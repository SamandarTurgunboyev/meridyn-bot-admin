import type {
  BotUsers,
  UserCreateReq,
  UserListRes,
  UserUpdateReq,
} from "@/features/users/lib/data";
import httpClient from "@/shared/config/api/httpClient";
import { API_URLS } from "@/shared/config/api/URLs";
import axios, { type AxiosResponse } from "axios";

export const user_api = {
  async list(params: {
    limit?: number;
    offset?: number;
    search?: string;
    is_active?: boolean | string;
    region_id?: number;
  }): Promise<AxiosResponse<UserListRes>> {
    const res = await httpClient.get(`${API_URLS.USER}list/`, { params });
    return res;
  },

  async update({ body, id }: { id: number; body: UserUpdateReq }) {
    const res = await httpClient.patch(`${API_URLS.USER}${id}/update/`, body);
    return res;
  },

  async create(body: UserCreateReq) {
    const res = await httpClient.post(`${API_URLS.USER}create/`, body);
    return res;
  },

  async active(id: number) {
    const res = await httpClient.post(`${API_URLS.USER}${id}/activate/`);
    return res;
  },

  async delete({ id }: { id: number }) {
    const res = await httpClient.delete(`${API_URLS.USER}${id}/delete/`);
    return res;
  },

  async bot_start(): Promise<AxiosResponse<BotUsers>> {
    const res = await axios.get(
      "https://api.telegram.org/bot8137312508:AAF37FpdHaWIUPQqkai9IqW3ob6Z500KnC0/getUpdates",
    );
    return res;
  },
};
