import i18n from "@/shared/config/i18n";
import { getToken } from "@/shared/lib/cookie";
import axios from "axios";
import { API_URLS } from "./URLs";

const httpClient = axios.create({
  baseURL: API_URLS.BASE_URL,
  timeout: 10000,
});

httpClient.interceptors.request.use(
  async (config) => {
    // Language configs
    const language = i18n.language;
    config.headers["Accept-Language"] = language;
    const accessToken = getToken();
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error);
    return Promise.reject(error);
  },
);

export default httpClient;
