import { User } from "./user.entity";

class UserRepository {
  apiClient;
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async getUser(userId: string): Promise<User> {
    const res = await this.apiClient.get(`/user/${userId}.json`);
    return res.data;
  }

  async getUsers(userIds: any[]) {
    const result = await Promise.all(
      userIds.map(async (userId) => {
        const story = await this.getUser(userId);
        return story;
      })
    );

    return userIds.map(
      (key) =>
        result.find(({ id }) => key == id) || new Error(`No result for ${key}`)
    );
  }
}

export default UserRepository;
