import DataLoader from "dataloader";

import {
  encodeToCursor,
  getSelectedList,
  IPaginationArguments,
} from "@src/helpers/cursor";

import UserRepository from "./user.repository";

class UserService {
  userRepository: UserRepository;
  userLoader: DataLoader<any, any, any>;
  constructor(
    userRepository: UserRepository,
    userLoader: DataLoader<any, any, any>
  ) {
    this.userRepository = userRepository;
    this.userLoader = userLoader;
  }

  async getUserById(userId: string) {
    return await this.userLoader.load(userId);
  }

  async getUsersByIds(userIds: string[], args: IPaginationArguments) {
    let { pageInfo } = getSelectedList(userIds, args);

    const users = await this.userLoader.loadMany(userIds);

    if (users.length > 0) {
      pageInfo.startCursor = encodeToCursor(users[0].id);
      pageInfo.endCursor = encodeToCursor(users[users.length - 1].id);
    }

    return { list: users, pageInfo, totalCount: userIds.length };
  }
}

export default UserService;
