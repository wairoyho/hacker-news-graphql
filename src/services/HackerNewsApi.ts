import axios from "axios";

export enum StoryType {
  TOP = "top",
  NEW = "new",
  BEST = "best",
  SHOW = "show",
  JOB = "job",
}

var apiRequestCount = 0;
var apiResponseCount = 0;

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

apiInstance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    apiRequestCount++;
    console.log("request sent", apiRequestCount);

    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
apiInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    apiResponseCount++;
    console.log("response received", apiResponseCount);

    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

const hackerNewsApi = {
  getItem: (itemId) => apiInstance.get(`/item/${itemId}.json`),
  getItems: async (keys) => {
    const result = await Promise.all(
      keys.map(async (key) => {
        const resp = await apiInstance.get(`/item/${key}.json`);
        return resp.data;
      })
    );

    return keys.map(
      (key) =>
        result.find(({ id }) => key == id) || new Error(`No result for ${key}`)
    );
  },
  getStories: (type: StoryType) =>
    apiInstance.get(`/${type.toLowerCase()}stories.json`),
  getUser: (userId) => apiInstance.get(`/user/${userId}.json`),
};

export default hackerNewsApi;
