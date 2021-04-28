import storyApiResonse from "../__fixtures__/storyApiResponse";

export const load = jest
  .fn()
  .mockImplementation((storyId) =>
    Promise.resolve(storyApiResonse.getById(storyId).data)
  );

export const loadMany = jest
  .fn()
  .mockImplementation((storyIds) =>
    Promise.all(
      storyIds.map((storyId) => storyApiResonse.getById(storyId).data)
    )
  );

const MockedStoryLoader = jest.fn().mockImplementation(() => ({
  load,
  loadMany,
}));

export default MockedStoryLoader;
