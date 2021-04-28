// @ts-nocheck

import ApiClient from "../apiClient";

jest.mock("axios");

const config = { get: (s) => s };

describe("ApiClient", () => {
  const apiClient = ApiClient(config, console);

  it("init", () => {
    expect(apiClient).toHaveBeenCalledTimes(0);
  });

  it("fetch /foobar", async () => {
    const endpoint = "/foobar";
    const responseData = "example response";

    const promise = apiClient.get(endpoint);
    apiClient.mockResponse({ data: responseData }, undefined, true);
    const result = await promise;

    expect(result).toHaveProperty("data", responseData);
    expect(apiClient.get).toHaveBeenCalledWith(endpoint);
    expect(apiClient.get).toHaveBeenCalledTimes(1);
  });

  it("fetch /foobar 2nd time", async () => {
    const endpoint = "/foobar";
    const responseData = "example response";

    const promise = apiClient.get(endpoint);
    apiClient.mockResponse({ data: responseData }, undefined, true);
    const result = await promise;

    expect(result).toHaveProperty("data", responseData);
    expect(apiClient.get).toHaveBeenCalledWith("/foobar");
    expect(apiClient.get).toHaveBeenCalledTimes(2);
  });
});
