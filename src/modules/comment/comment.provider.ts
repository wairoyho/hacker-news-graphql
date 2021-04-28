import DataLoader from "dataloader";

import CommentLoader from "@modules/comment/comment.loader";
import CommentRepository from "@modules/comment/comment.repository";
import CommentService from "@modules/comment/comment.service";
import CommentResolver from "@modules/comment/comment.resolvers";

export interface ICommentServices {
  commentRepository?: CommentRepository;
  commentLoader?: DataLoader<any, any, any>;
  commentService?: CommentService;
  commentResolver?: any;
}

export enum SERVICES {
  COMMENT_REPOSITORY = "commentRepository",
  COMMENT_LOADER = "commentLoader",
  COMMENT_SERVICE = "commentService",
  COMMENT_RESOLVER = "commentResolver",
}

// import { CONTAINER_SERVICE } from "src/services";

const commentProvider = (container, CONTAINER_SERVICE) => {
  container.register(SERVICES.COMMENT_REPOSITORY, CommentRepository, [
    CONTAINER_SERVICE.API_CLIENT,
    CONTAINER_SERVICE.LOGGER,
  ]);
  container.register(SERVICES.COMMENT_LOADER, CommentLoader, [
    SERVICES.COMMENT_REPOSITORY,
    CONTAINER_SERVICE.LOGGER,
  ]);
  container.register(SERVICES.COMMENT_SERVICE, CommentService, [
    SERVICES.COMMENT_REPOSITORY,
    SERVICES.COMMENT_LOADER,
    CONTAINER_SERVICE.LOGGER,
  ]);
  container.register(SERVICES.COMMENT_RESOLVER, CommentResolver, [
    SERVICES.COMMENT_SERVICE,
    CONTAINER_SERVICE.LOGGER,
  ]);
};

export default commentProvider;
