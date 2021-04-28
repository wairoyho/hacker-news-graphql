import DataLoader from "dataloader";

// import CacheService from "@modules/cache/cache.service";

// const ttl = 60 * 5 * 1; // cache for 5 mins
// const cache = new CacheService(ttl);

export type IStoryLoader = DataLoader<any, any, any>;

const storyLoader = (storyRepository, logger): IStoryLoader =>
  new DataLoader(async (keys) => {
    const resp = await storyRepository.getStories(keys);
    logger.debug("rsp", resp);
    return resp;
  });

export default storyLoader;
