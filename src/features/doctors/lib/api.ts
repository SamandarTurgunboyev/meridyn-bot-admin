import type { DoctorListRes } from "@/features/doctors/lib/data";
import httpClient from "@/shared/config/api/httpClient";
import { DOCTOR } from "@/shared/config/api/URLs";
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
  }): Promise<AxiosResponse<DoctorListRes>> {
    const res = await httpClient.get(`${DOCTOR}list/`, { params });
    return res;
  },
};
