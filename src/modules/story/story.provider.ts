import DataLoader from "dataloader";

import StoryLoader from "@modules/story/story.loader";
import StoryRepository from "@modules/story/story.repository";
import StoryService from "@modules/story/story.service";
import StoryResolver from "@modules/story/story.resolvers";

export interface IStoryServices {
  storyRepository?: StoryRepository;
  storyLoader?: DataLoader<any, any, any>;
  storyService?: StoryService;
  storyResolver?: any;
}

enum SERVICES {
  STORY_REPOSITORY = "storyRepository",
  STORY_LOADER = "storyLoader",
  STORY_SERVICE = "storyService",
  STORY_RESOLVER = "storyResolver",
}

const storyProvider = (container, CONTAINER_SERVICE) => {
  container.register(SERVICES.STORY_REPOSITORY, StoryRepository, [
    CONTAINER_SERVICE.API_CLIENT,
    CONTAINER_SERVICE.LOGGER,
  ]);
  container.register(SERVICES.STORY_LOADER, StoryLoader, [
    SERVICES.STORY_REPOSITORY,
    CONTAINER_SERVICE.LOGGER,
  ]);
  container.register(SERVICES.STORY_SERVICE, StoryService, {
    storyRepository: SERVICES.STORY_REPOSITORY,
    storyLoader: SERVICES.STORY_LOADER,
    logger: CONTAINER_SERVICE.LOGGER,
    cache: CONTAINER_SERVICE.CACHE,
  });
  container.register(SERVICES.STORY_RESOLVER, StoryResolver, [
    SERVICES.STORY_SERVICE,
    CONTAINER_SERVICE.LOGGER,
  ]);
};

export default storyProvider;
