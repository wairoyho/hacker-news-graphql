import DataLoader from "dataloader";

import UserLoader from "@modules/user/user.loader";
import UserRepository from "@modules/user/user.repository";
import UserService from "@modules/user/user.service";
import UserResolver from "@modules/user/user.resolvers";

export interface IUserServices {
  userRepository?: UserRepository;
  userLoader?: DataLoader<any, any, any>;
  userService?: UserService;
  userResolver?: any;
}

export enum SERVICES {
  USER_REPOSITORY = "userRepository",
  USER_LOADER = "userLoader",
  USER_SERVICE = "userService",
  USER_RESOLVER = "userResolver",
}

// import { CONTAINER_SERVICE } from "src/services";

const userProvider = (container, CONTAINER_SERVICE) => {
  container.register(SERVICES.USER_REPOSITORY, UserRepository, [
    CONTAINER_SERVICE.API_CLIENT,
    CONTAINER_SERVICE.LOGGER,
  ]);
  container.register(SERVICES.USER_LOADER, UserLoader, [
    SERVICES.USER_REPOSITORY,
    CONTAINER_SERVICE.LOGGER,
  ]);
  container.register(SERVICES.USER_SERVICE, UserService, [
    SERVICES.USER_REPOSITORY,
    SERVICES.USER_LOADER,
    CONTAINER_SERVICE.LOGGER,
  ]);
  container.register(SERVICES.USER_RESOLVER, UserResolver, [
    SERVICES.USER_SERVICE,
    CONTAINER_SERVICE.LOGGER,
  ]);
};

export default userProvider;
