import axios, { AxiosInstance } from "axios";

let apiRequestCount = 0;
let apiResponseCount = 0;

export type ApiClientInstance = AxiosInstance;

export const ApiClient = (config, logger) => {
  // console.log("apiClient", config, logger);
  let apiInstance = axios.create({
    baseURL: config.get("service.hackerNews.apiBaseUrl"),
    responseType: "json",
    headers: {
      "Content-Type": "application/json",
      // Cookie: publicRuntimeConfig.tempCookie || null,
    },
    timeout: 30000,
    // withCredentials: true,
  });

  apiInstance.interceptors.request.use(
    (config) => {
      apiRequestCount++;
      console.log("request sent", apiRequestCount);

      return config;
    },
    (error) => Promise.reject(error)
  );

  apiInstance.interceptors.response.use(
    (response) => {
      apiResponseCount++;
      console.log("response received", apiResponseCount);

      return response;
    },
    (error) => Promise.reject(error)
  );

  return apiInstance;
};

export default ApiClient;
