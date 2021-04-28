import axios from "axios";

const apiInstance = axios.create({
  baseURL: process.env.HACKER_NEW_SERVICE_API_BASE_URL,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
    // Cookie: publicRuntimeConfig.tempCookie || null,
  },
  timeout: 30000,
  // withCredentials: true,
});

export default apiInstance;
