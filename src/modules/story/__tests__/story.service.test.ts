// @ts-nocheck

import config from "@config";
import ApiClient from "@src/helpers/apiClient";
import Cache from "@modules/cache/cache.service";
import Logger from "@modules/logger/logger.service";

import { StoryType } from "../story.constant";
import StoryLoader from "../story.loader";
import StoryRepository from "../story.repository";
import StoryService from "../story.service";

import storyApiResonse from "../__fixtures__/storyApiResponse";

jest.mock("@src/config");
jest.mock("@src/helpers/apiClient");
jest.mock("@modules/logger/logger.service");
jest.mock("../story.loader");
jest.mock("../story.repository");

describe("Story service", () => {
  const logger = Logger({ config });
  const apiClient = ApiClient(config, logger);
  const cache = new Cache(0);
  const storyRepository = new StoryRepository(apiClient);
  const storyLoader = StoryLoader(storyRepository, logger);

  test("init", () => {
    const storyService = new StoryService({
      storyRepository,
      storyLoader,
      logger,
      cache,
    });

    expect(storyService.storyRepository).toBe(storyRepository);
    expect(storyService.storyLoader).toBe(storyLoader);
  });

  it("getStoryById", async () => {
    const storyId = "10001";
    const mockedApiResp = storyApiResonse.getById(storyId);
    const { data: expectedResult } = mockedApiResp;

    const storyService = new StoryService({
      storyRepository,
      storyLoader,
      logger,
      cache,
    });
    const result = await storyService.getStoryById(storyId);

    expect(result).toEqual(expectedResult);
    expect(result).toMatchSnapshot();
  });

  it(`getStories`, async () => {
    const storyIds = ["10001", "10002", "10003"];
    const type = StoryType.NEW;
    const paginationArgs = {
      first: 3,
      last: undefined,
      before: undefined,
      after: undefined,
    };
    const mockedRespList = storyIds.map(storyApiResonse.getById);

    const expectedResult = {
      list: mockedRespList.map((mockedResp) => mockedResp.data),
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: "MTAwMDE=",
        endCursor: "MTAwMDM=",
      },
      totalCount: paginationArgs.first,
    };

    const storyService = new StoryService({
      storyRepository,
      storyLoader,
      logger,
      cache,
    });
    const result = await storyService.getStories(type, paginationArgs);

    expect(result).toHaveProperty("list", expectedResult.list);
    expect(result).toHaveProperty(
      "pageInfo.hasNextPage",
      expectedResult.pageInfo.hasNextPage
    );
    expect(result).toHaveProperty(
      "pageInfo.hasPreviousPage",
      expectedResult.pageInfo.hasPreviousPage
    );
    expect(result).toHaveProperty("pageInfo.startCursor");
    expect(result).toHaveProperty("pageInfo.endCursor");
    expect(result).toHaveProperty("totalCount", expectedResult.totalCount);
  });

  it(`getStories: no stories`, async () => {
    const type = StoryType.NEW;
    const paginationArgs = {
      first: 3,
      last: undefined,
      before: undefined,
      after: undefined,
    };
    storyRepository.getStoryList.mockResolvedValueOnce([]);

    const expectedResult = {
      list: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
      totalCount: 0,
    };

    const storyService = new StoryService({
      storyRepository,
      storyLoader,
      logger,
      cache,
    });
    const result = await storyService.getStories(type, paginationArgs);

    expect(result).toHaveProperty("list", expectedResult.list);
    expect(result).toHaveProperty("pageInfo", expectedResult.pageInfo);
    expect(result).toHaveProperty("totalCount", expectedResult.totalCount);
  });

  it(`getLastestStories`, async () => {
    const storyIds = ["10001", "10002", "10003"];
    const paginationArgs = {
      first: 3,
      last: undefined,
      before: undefined,
      after: undefined,
    };
    const mockedRespList = storyIds.map(storyApiResonse.getById);

    const expectedResult = {
      list: mockedRespList.map((mockedResp) => mockedResp.data),
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: "MTAwMDE=",
        endCursor: "MTAwMDM=",
      },
      totalCount: paginationArgs.first,
    };

    const storyService = new StoryService({
      storyRepository,
      storyLoader,
      logger,
      cache,
    });
    const result = await storyService.getLastestStories(paginationArgs);

    expect(result).toHaveProperty("list", expectedResult.list);
    expect(result).toHaveProperty(
      "pageInfo.hasNextPage",
      expectedResult.pageInfo.hasNextPage
    );
    expect(result).toHaveProperty(
      "pageInfo.hasPreviousPage",
      expectedResult.pageInfo.hasPreviousPage
    );
    expect(result).toHaveProperty("pageInfo.startCursor");
    expect(result).toHaveProperty("pageInfo.endCursor");
    expect(result).toHaveProperty("totalCount", expectedResult.totalCount);
  });

  it(`getLastestStories: no stories`, async () => {
    const paginationArgs = {
      first: 3,
      last: undefined,
      before: undefined,
      after: undefined,
    };
    storyRepository.getStoryList.mockResolvedValueOnce([]);

    const expectedResult = {
      list: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
      totalCount: 0,
    };

    const storyService = new StoryService({
      storyRepository,
      storyLoader,
      logger,
      cache,
    });
    const result = await storyService.getLastestStories(paginationArgs);

    expect(result).toHaveProperty("list", expectedResult.list);
    expect(result).toHaveProperty("pageInfo", expectedResult.pageInfo);
    expect(result).toHaveProperty("totalCount", expectedResult.totalCount);
  });
});
