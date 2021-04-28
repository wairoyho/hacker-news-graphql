// @ts-nocheck

import config from "@config";
import ApiClient from "@src/helpers/apiClient";
import Logger from "@modules/logger/logger.service";

// import { Story } from "../story.entity";
import { StoryType } from "../story.constant";
import StoryRepository from "../story.repository";

import storyApiResonse from "../__fixtures__/storyApiResponse";

jest.mock("@src/config");
jest.mock("@src/helpers/apiClient");
jest.mock("@modules/logger/logger.service");

describe("Story repository", () => {
  const logger = Logger({ config });
  const apiClient = ApiClient(config, logger);

  // beforeEach(() => {
  //   // Clear all instances and calls to constructor and all methods:
  //   MockStoryRepository.mockClear();
  //   mockAxios.mockResponse({ data: responseData }, undefined, true);
  // });

  it("init", () => {
    const storyRepo = new StoryRepository(apiClient);
    expect(storyRepo.apiClient).not.toBeNull();
  });

  it("getItems", async () => {
    const itemId = "10001";
    const mockedApiResp = storyApiResonse.getById(itemId);
    const { data: expectedResult } = mockedApiResp;

    const storyRepo = new StoryRepository(apiClient);
    const promise = storyRepo.getItem(itemId);
    apiClient.mockResponse(mockedApiResp, undefined, true);
    const result = await promise;

    expect(result).toHaveProperty(["id"], mockedApiResp.data.id);
    expect(result).toEqual(expectedResult);
  });

  it("getStory", async () => {
    const storyId = "10001";
    const mockedApiResp = storyApiResonse.getById(storyId);
    const { data: expectedResult } = storyApiResonse.getById(storyId);

    const storyRepo = new StoryRepository(apiClient);
    const promise = storyRepo.getStory(storyId);
    apiClient.mockResponse(mockedApiResp, undefined, true);
    const result = await promise;

    expect(result).toEqual(expectedResult);
  });

  it("getStories: get one", async () => {
    const storyId = "10001";
    const storyIds = [storyId];
    const mockedApiResp = storyApiResonse.getById(storyId);
    const expectedResult = [mockedApiResp.data];

    const storyRepo = new StoryRepository(apiClient);
    const promise = storyRepo.getStories(storyIds);
    apiClient.mockResponseFor({ url: `/item/${storyId}.json` }, mockedApiResp);
    const result = await promise;

    // console.log("result", result, expectedResult);
    expect(result).toEqual(expectedResult);
  });

  it("getStories: get two", async () => {
    const storyIdOne = "10001";
    const storyIdTwo = "10002";
    const storyIds = [storyIdOne, storyIdTwo];
    const mockedApiRespOne = storyApiResonse.getById(storyIdOne);
    const mockedApiRespTwo = storyApiResonse.getById(storyIdTwo);
    const expectedResult = [mockedApiRespOne.data, mockedApiRespTwo.data];

    const storyRepo = new StoryRepository(apiClient);
    const promise = storyRepo.getStories(storyIds);
    apiClient.mockResponseFor(
      { url: `/item/${storyIdOne}.json` },
      mockedApiRespOne
    );
    apiClient.mockResponseFor(
      { url: `/item/${storyIdTwo}.json` },
      mockedApiRespTwo
    );
    const result = await promise;

    // console.log("result", result, expectedResult);
    expect(result).toEqual(expectedResult);
  });

  it("getStories: resource not found", async () => {
    const storyId = "875";
    const storyIds = [storyId];
    const mockedApiResp = storyApiResonse.getById(storyId);
    const expectedResult = [new Error(`No result for ${storyIds[0]}`)];

    const storyRepo = new StoryRepository(apiClient);
    const promise = storyRepo.getStories(storyIds);
    apiClient.mockResponse(mockedApiResp, undefined, true);
    const result = await promise.catch((error) => error);

    expect(result).toEqual(expectedResult);
  });

  it("getStoryList: type = new", async () => {
    const type = StoryType.NEW;
    const mockedApiResp = storyApiResonse.getList(type);
    const { data: expectedResult } = mockedApiResp;

    const storyRepo = new StoryRepository(apiClient);
    const promise = storyRepo.getStoryList(type);
    apiClient.mockResponse(mockedApiResp, undefined, true);
    const result = await promise;

    expect(result).toEqual(expectedResult);
  });
});
