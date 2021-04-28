import { StoryType } from "./story.constant";
import { Story } from "./story.entity";

class StoryRepository {
  apiClient;
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async getItem(itemId: string): Promise<Story> {
    const res = await this.apiClient.get(`/item/${itemId}.json`);
    return res.data;
  }

  async getStory(storyId: string) {
    return this.getItem(storyId);
  }

  async getStories(storyIds: any[]) {
    const result = await Promise.all(
      storyIds.map(async (storyId) => {
        const story = await this.getStory(storyId);
        return story;
      })
    );

    return storyIds.map(
      (key) =>
        result.find(({ id }) => key == id) || new Error(`No result for ${key}`)
    );
  }

  async getStoryList(type: StoryType): Promise<number[]> {
    const res = await this.apiClient.get(`/${type.toLowerCase()}stories.json`);
    return res.data;
  }
}

export default StoryRepository;
