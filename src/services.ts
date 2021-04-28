import { createNamespace } from "cls-hooked";
import EventEmitter from "events";
import Express from "express";
import { v4 as uuid4 } from "uuid";

import config, { IConfig } from "@config";

import Cache from "@modules/cache/cache.service";
import Logger, { ILogger } from "@modules/logger/logger.service";
import StoryServiceProvider, {
  IStoryServices,
} from "@modules/story/story.provider";
import CommentServiceProvider, {
  ICommentServices,
} from "@modules/comment/comment.provider";
import UserServiceProvider, {
  IUserServices,
} from "@modules/user/user.provider";

import ApiClient, { ApiClientInstance } from "src/helpers/apiClient";
import Container from "src/Container";

enum CONTAINER_SERVICE {
  CONFIG = "config",
  API_CLIENT = "apiClient",
  LOGGER = "logger",
  CACHE = "cache",
}

declare global {
  interface IServices extends ICommentServices, IStoryServices, IUserServices {
    config?: IConfig;
    apiClient?: ApiClientInstance;
    logger?: ILogger;
    cache?: Cache;
  }
}

export default () => {
  const namespace = createNamespace(uuid4());

  const container = new Container(namespace);
  const express = Express();

  express.use((req, res, next) => {
    namespace.bindEmitter(req);
    namespace.bindEmitter(res);

    namespace.run(() => {
      next();
    });
  });

  container.register(CONTAINER_SERVICE.CONFIG, () => config);
  container.register("express", () => express);
  container.register("events", EventEmitter);
  // container.register("session", Session, ["auth", "db"], { scoped: true });
  container.register(CONTAINER_SERVICE.LOGGER, Logger, {
    config: CONTAINER_SERVICE.CONFIG,
  });
  container.register(CONTAINER_SERVICE.API_CLIENT, ApiClient, [
    CONTAINER_SERVICE.CONFIG,
    CONTAINER_SERVICE.LOGGER,
  ]);
  container.register(CONTAINER_SERVICE.CACHE, Cache);

  StoryServiceProvider(container, CONTAINER_SERVICE);
  CommentServiceProvider(container, CONTAINER_SERVICE);
  UserServiceProvider(container, CONTAINER_SERVICE);

  // container.register("dbConnection", DatabaseConnection, ["config", "logger"]);
  // container.register("db", Database, ["dbConnection"]);
  // container.register("signer", Signer, ["config"]);
  // container.register("mailerTransport", MailerTransport, ["config"]);
  // container.register("mailer", Mailer, [
  //   "config",
  //   "logger",
  //   "mailerTransport",
  //   "views",
  // ]);
  // container.register("auth", Auth, ["config", "logger", "db", "signer"]);
  // container.register("stripe", Stripe, ["config"]);
  // container.register("password", Password);

  return container;
};
