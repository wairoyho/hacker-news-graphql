import mockAxios from "jest-mock-axios";

const ApiClient = (config, logger) => {
  return mockAxios;
};

export default ApiClient;
