import httpClient from "@/shared/config/api/httpClient";
import { API_URLS } from "@/shared/config/api/URLs";
import type { GetMeRes } from "@/shared/config/api/user/type";
import type { AxiosResponse } from "axios";

export const user_api = {
  async getMe(): Promise<AxiosResponse<GetMeRes>> {
    const res = httpClient.get(API_URLS.GET_ME);
    return res;
  },
};
