import httpClient from "@/shared/config/api/httpClient";
import { LOGIN } from "@/shared/config/api/URLs";
import type { AxiosResponse } from "axios";

interface LoginRes {
  status_code: number;
  status: string;
  message: string;
  data: {
    token: string;
  };
}

export const auth_pai = {
  async login(body: {
    username: string;
    password: string;
  }): Promise<AxiosResponse<LoginRes>> {
    const res = await httpClient.post(LOGIN, body);
    return res;
  },
};
