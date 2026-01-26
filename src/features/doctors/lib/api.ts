import type {
  CreateDoctorReq,
  DoctorListRes,
  UpdateDoctorReq,
} from "@/features/doctors/lib/data";
import httpClient from "@/shared/config/api/httpClient";
import { API_URLS } from "@/shared/config/api/URLs";
import type { AxiosResponse } from "axios";

export const doctor_api = {
  async list(params: {
    limit?: number;
    offset?: number;
    full_name?: string;
    district_name?: string;
    place_name?: string;
    work_place?: string;
    sphere?: string;
    user?: string;
    user_id?: number;
  }): Promise<AxiosResponse<DoctorListRes>> {
    const res = await httpClient.get(`${API_URLS.DOCTOR}list/`, { params });
    return res;
  },

  async create(body: CreateDoctorReq) {
    const res = await httpClient.post(`${API_URLS.DOCTOR}create/`, body);
    return res;
  },

  async update({ body, id }: { id: number; body: UpdateDoctorReq }) {
    const res = await httpClient.patch(`${API_URLS.DOCTOR}${id}/update/`, body);
    return res;
  },

  async delete(id: number) {
    const res = await httpClient.delete(`${API_URLS.DOCTOR}${id}/delete/`);
    return res;
  },

  async export() {
    const res = await httpClient.get(`${API_URLS.DOCTOR_EXPORT}`, {
      responseType: "blob",
    });
    return res;
  },
};
