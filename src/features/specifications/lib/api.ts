import type {
  OrderCreateReq,
  OrderListRes,
  OrderUpdateReq,
} from "@/features/specifications/lib/data";
import httpClient from "@/shared/config/api/httpClient";
import { API_URLS } from "@/shared/config/api/URLs";
import type { AxiosResponse } from "axios";

export const order_api = {
  async list(params: {
    limit: number;
    offset: number;
  }): Promise<AxiosResponse<OrderListRes>> {
    const res = await httpClient.get(`${API_URLS.ORDER}list/`, { params });
    return res;
  },

  async create(body: OrderCreateReq) {
    const res = await httpClient.post(`${API_URLS.ORDER}create/`, body);
    return res;
  },

  async update({ body, id }: { id: number; body: OrderUpdateReq }) {
    const res = await httpClient.patch(`${API_URLS.ORDER}${id}/update/`, body);
    return res;
  },

  async delete(id: number) {
    const res = await httpClient.delete(`${API_URLS.ORDER}${id}/delete/`);
    return res;
  },
};
