// @ts-nocheck

import DataLoader from "dataloader";

import config from "@config";
import ApiClient from "@src/helpers/apiClient";
import Logger from "@modules/logger/logger.service";

import StoryLoader from "../story.loader";
import StoryRepository from "../story.repository";

import storyApiResonse from "../__fixtures__/storyApiResponse";

jest.mock("@src/config");
jest.mock("@src/helpers/apiClient");
jest.mock("@modules/logger/logger.service");
jest.mock("../story.repository");

describe("Story loader", () => {
  const logger = Logger({ config });
  const apiClient = ApiClient(config, logger);
  const storyRepo = new StoryRepository(apiClient);

  it("init", () => {
    const storyLoader = StoryLoader(storyRepo, logger);

    expect(storyLoader).not.toBeNull();
    expect(storyLoader).toBeInstanceOf(DataLoader);
  });

  it("load one", async () => {
    const storyId = "10001";
    const mockedApiResp = storyApiResonse.getById(storyId);
    const { data: expectedResult } = mockedApiResp;

    const storyLoader = StoryLoader(storyRepo, logger);
    const result = await storyLoader.load(storyId);

    expect(result).toEqual(expectedResult);
  });

  it("load many", async () => {
    const storyIdOne = "10001";
    const storyIdTwo = "10002";
    const storyIds = [storyIdOne, storyIdTwo];
    const mockedApiRespOne = storyApiResonse.getById(storyIdOne);
    const mockedApiRespTwo = storyApiResonse.getById(storyIdTwo);
    const expectedResult = [mockedApiRespOne.data, mockedApiRespTwo.data];

    const storyLoader = StoryLoader(storyRepo, logger);
    const stories = await storyLoader.loadMany(storyIds);

    expect(stories).toEqual(expectedResult);
  });
});
