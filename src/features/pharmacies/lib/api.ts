import type {
  CreatePharmaciesReq,
  PharmaciesListRes,
  UpdatePharmaciesReq,
} from "@/features/pharmacies/lib/data";
import httpClient from "@/shared/config/api/httpClient";
import { PHARMACIES } from "@/shared/config/api/URLs";
import type { AxiosResponse } from "axios";

export const pharmacies_api = {
  async list(params: {
    limit?: number;
    offset?: number;
    name?: string;
    place?: string;
    district?: string;
    user?: string;
  }): Promise<AxiosResponse<PharmaciesListRes>> {
    const res = await httpClient.get(`${PHARMACIES}list/`, { params });
    return res;
  },

  async create(body: CreatePharmaciesReq) {
    const res = await httpClient.post(`${PHARMACIES}create/`, body);
    return res;
  },

  async update({ body, id }: { id: number; body: UpdatePharmaciesReq }) {
    const res = await httpClient.patch(`${PHARMACIES}${id}/update/`, body);
    return res;
  },

  async delete(id: number) {
    const res = await httpClient.delete(`${PHARMACIES}${id}/delete/`);
    return res;
  },
};
