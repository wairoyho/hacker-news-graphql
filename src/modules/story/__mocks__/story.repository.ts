import storyApiResonse from "../__fixtures__/storyApiResponse";

export const getItem = jest
  .fn()
  .mockImplementation((storyId) =>
    Promise.resolve(storyApiResonse.getById(storyId).data)
  );
export const getStory = getItem;
export const getStories = jest
  .fn()
  .mockImplementation((storyIds) =>
    Promise.all(
      storyIds.map((storyId) => storyApiResonse.getById(storyId).data)
    )
  );
export const getStoryList = jest
  .fn()
  .mockImplementation((type) =>
    Promise.resolve(storyApiResonse.getList(type).data)
  );

const mock = jest.fn().mockImplementation(() => {
  return {
    getItem,
    getStory,
    getStories,
    getStoryList,
  };
});

export default mock;
