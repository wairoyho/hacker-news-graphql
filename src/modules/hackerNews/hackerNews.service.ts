import HackerNewsRepository from "./hackerNews.repository";

class HackerNewsService {
  hackerNewsRepository: HackerNewsRepository;
  constructor(hackerNewsRepository: HackerNewsRepository) {
    this.hackerNewsRepository = hackerNewsRepository;
  }

  async getStory(storyId) {
    const story = await this.hackerNewsRepository.getItem(storyId);
    return story;
  }

  async getLastestStoryList() {
    return;
  }
}

export default HackerNewsService;
