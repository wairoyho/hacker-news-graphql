import DataLoader from "dataloader";

import {
  encodeToCursor,
  destructureCursor,
  getSelectedList,
  IPaginationArguments,
} from "@src/helpers/cursor";
import { ILogger } from "@modules/logger/logger.service";
import Cache from "@modules/cache/cache.service";

import { StoryType } from "./story.constant";
import StoryRepository from "./story.repository";

const extractCursorPrefix = (cursor) => {
  return destructureCursor(cursor).slice(0, -1);
};

const getCursorPrefix = (type, before = undefined, after = undefined) => {
  let prefix = "";
  if (before || after) {
    const snapshotVersion = before
      ? extractCursorPrefix(before)
      : extractCursorPrefix(after);
    prefix = snapshotVersion.join(":");
  } else {
    prefix = createStoryListCursorPrefix(type);
  }
  return prefix;
};

const createStoryListCursorPrefix = (type) => {
  // pre min snapshoot
  const coeff = 1000 * 10 * 1;
  const snapshotId = new Date(Math.floor(Date.now() / coeff) * coeff).getTime();

  return `story_list:${type.toLowerCase()}:${snapshotId}`;
};

class StoryService {
  storyRepository: StoryRepository;
  storyLoader: DataLoader<any, any, any>;
  logger: ILogger;
  cache: Cache;

  constructor({ storyRepository, storyLoader, logger, cache }) {
    this.storyRepository = storyRepository;
    this.storyLoader = storyLoader;
    this.logger = logger;
    this.cache = cache;
  }

  async getStoryById(storyId: string) {
    return await this.storyLoader.load(storyId);
  }

  async getStories(type: StoryType, args: IPaginationArguments) {
    const { first, last, before, after } = args;

    let snapshotPrefix = getCursorPrefix(type, before, after);

    let storyIdList = [];
    // if (before || after) {
    //   const snapshotVersion = before
    //     ? extractCursorPrefix(before)
    //     : extractCursorPrefix(after);

    //   snapshotPrefix = snapshotVersion.join(":");

    //   if (this.cache.has(snapshotVersion)) {
    //     storyIdList = (await this.cache.get(snapshotPrefix)) ?? [];
    //   }
    // } else {
    //   storyIdList = await this.cache.get(snapshotPrefix, () =>
    //     this.storyRepository.getStoryList(type)
    //   );
    // }
    console.log("snapshotPrefix", snapshotPrefix);
    if (before || after) {
      storyIdList = (await this.cache.get(snapshotPrefix)) ?? [];
    } else {
      storyIdList = await this.cache.get(snapshotPrefix, () =>
        this.storyRepository.getStoryList(type)
      );
    }

    let { list, pageInfo } = getSelectedList(storyIdList, args);
    const stories = await this.storyLoader.loadMany(list);

    const filteredStories = stories.filter((story) => story !== null);

    if (filteredStories.length > 0) {
      this.logger.debug("stories", stories);
      pageInfo.startCursor = encodeToCursor(stories[0].id, snapshotPrefix);
      pageInfo.endCursor = encodeToCursor(
        stories[stories.length - 1].id,
        snapshotPrefix
      );
    }

    return {
      list: filteredStories,
      pageInfo,
      totalCount: storyIdList.length,
      cursorPrefix: snapshotPrefix,
    };
  }

  async getLastestStories(args: IPaginationArguments) {
    const { first, last, before, after } = args;

    const storyIdList = await this.storyRepository.getStoryList(StoryType.NEW);

    let { list, pageInfo } = getSelectedList(storyIdList, args);
    const stories = await this.storyLoader.loadMany(list);

    const filteredStories = stories.filter((story) => story !== null);

    if (filteredStories.length > 0) {
      pageInfo.startCursor = encodeToCursor(
        stories[0].id,
        createStoryListCursorPrefix(StoryType.NEW)
      );
      pageInfo.endCursor = encodeToCursor(
        stories[stories.length - 1].id,
        createStoryListCursorPrefix(StoryType.NEW)
      );
    }

    return { list: filteredStories, pageInfo, totalCount: storyIdList.length };
  }
}

export default StoryService;
