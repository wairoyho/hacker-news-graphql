import DataLoader from "dataloader";

import {
  encodeToCursor,
  getSelectedList,
  IPaginationArguments,
} from "@src/helpers/cursor";

import CommentRepository from "./comment.repository";

class CommentService {
  commentRepository: CommentRepository;
  commentLoader: DataLoader<any, any, any>;
  constructor(
    commentRepository: CommentRepository,
    commentLoader: DataLoader<any, any, any>
  ) {
    this.commentRepository = commentRepository;
    this.commentLoader = commentLoader;
  }

  async getCommentById(commentId: string) {
    return await this.commentLoader.load(commentId);
  }

  async getCommentsByIds(commentIds: string[], args: IPaginationArguments) {
    let { pageInfo } = getSelectedList(commentIds, args);

    const comments = await this.commentLoader.loadMany(commentIds);

    if (comments.length > 0) {
      pageInfo.startCursor = encodeToCursor(comments[0].id);
      pageInfo.endCursor = encodeToCursor(comments[comments.length - 1].id);
    }

    return { list: comments, pageInfo, totalCount: commentIds.length };
  }
}

export default CommentService;
