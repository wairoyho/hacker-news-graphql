// @ts-nocheck

import config from "@config";
import ApiClient from "@src/helpers/apiClient";
import Logger from "@modules/logger/logger.service";

import { StoryType } from "../story.constant";
import StoryLoader from "../story.loader";
import StoryRepository from "../story.repository";
import StoryService from "../story.service";
import storyResovlers from "../story.resolvers";

import storyApiResonse from "../__fixtures__/storyApiResponse";

jest.mock("@src/config");
jest.mock("@src/helpers/apiClient");
jest.mock("@modules/logger/logger.service");
jest.mock("../story.loader");
jest.mock("../story.repository");
// jest.mock("../story.service");

describe("Story resolver", () => {
  const logger = Logger({ config });
  const apiClient = ApiClient(config, logger);
  const storyRepo = new StoryRepository(apiClient);
  const storyLoader = StoryLoader(storyRepo, logger);
  const storyService = new StoryService(storyRepo, storyLoader, logger);

  it("pass thought", () => {
    expect(null).toEqual(null);
  });

  it("will fail every time", () => {
    const user = {
      createdAt: new Date("2020-12-02T09:23:54.907Z"),
      id: 14,
      name: "LeBron James",
    };

    expect(user).toMatchSnapshot();
  });

  // it("query: Story", async () => {
  //   const storyId = "10001";
  //   const resolveArgs = {
  //     parent: undefined,
  //     args: {
  //       id: storyId,
  //     },
  //   };
  //   const expectedResult = storyApiResonse.getById(storyId).data;

  //   const resovlers = storyResovlers({ storyService, logger });
  //   const result = await resovlers.Query.Story(
  //     resolveArgs.parent,
  //     resolveArgs.args
  //   );

  //   expect(result).toBe(expectedResult);
  // });

  // it("query: StoryList", async () => {
  //   const storyIds = ["10001", "10002", "10003"];
  //   const resolveArgs = {
  //     parent: undefined,
  //     args: {
  //       type: "new",
  //       first: 3,
  //     },
  //   };

  //   const mockDataList = storyIds.map((storyId) =>
  //     storyApiResonse.getById(storyId)
  //   );

  //   const expectedResult = {
  //     list: mockDataList.map((mockData) => mockData.data),
  //     pageInfo: {
  //       hasNextPage: false,
  //       hasPreviousPage: false,
  //       startCursor: "MTAwMDE=",
  //       endCursor: "MTAwMDM=",
  //     },
  //     totalCount: resolveArgs.args.first,
  //   };

  //   const resovlers = storyResovlers({ storyService, logger });
  //   const result = await resovlers.Query.StoryList(
  //     resolveArgs.parent,
  //     resolveArgs.args
  //   );

  //   console.log("result", JSON.stringify(result, null, 2));
  //   expect(result).toBe(expectedResult);
  // });
});
