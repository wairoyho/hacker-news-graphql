import { encodeToCursor } from "@src/helpers/cursor";

import { resolveCommentList } from "@modules/comment/comment.resolvers";
import { resolveUser } from "@modules/user/user.resolvers";

const resolveStory = ({ storyService }: IServices) => async (
  parent,
  args,
  ctx,
  info
) => {
  const { id } = args;

  const story = await storyService.getStoryById(id);

  return story;
};

const resolveStoryList = ({ storyService, logger }: IServices) => async (
  parent,
  args,
  ctx
) => {
  logger.info(args);
  const { type, first, last, after, before } = args;

  try {
    const {
      list: stories,
      pageInfo,
      totalCount,
      cursorPrefix,
    } = await storyService.getStories(type, args);

    return {
      edges: stories.map((story) => ({
        cursor: encodeToCursor(story.id, cursorPrefix),
        node: story,
      })),
      nodes: stories,
      pageInfo,
      totalCount: totalCount,
    };
  } catch (e) {
    throw new Error(e);
  }
};

const resolvers = (services: IServices) => ({
  Query: {
    Story: resolveStory(services),
    StoryList: resolveStoryList(services),
  },
  Story: {
    comments: resolveCommentList(services),
    author: resolveUser(services),
  },
});

export default resolvers;
