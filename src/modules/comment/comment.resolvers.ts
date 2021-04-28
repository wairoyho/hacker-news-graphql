import { resolveUser } from "@modules/user/user.resolvers";

const resolveComment = ({ commentService }: IServices) => async (
  parent,
  args,
  ctx
) => {
  console.log(parent, args);
  const { id } = args;

  const comment = await commentService.getCommentById(id);

  return comment;
};

export const resolveCommentList = ({ commentService }: IServices) => async (
  parent,
  args,
  ctx,
  info
) => {
  console.log(parent, args);
  const { parentId, first = 10, last, after, before } = args;

  let commentIds = [];
  if (parentId) {
    // TODO: it can be story
    let comment = await commentService.getCommentById(parentId);
    // const subComments = Promise.all(
    //   comment.kids.map(async (kid) => await commentService.getCommentById(kid))
    // );
    // console.log("subComments", subComments);
    // comment.comments = subComments;
    commentIds = comment.kids;
  }

  if (parent) {
    commentIds = parent?.kids ?? [];
  }

  // const commentIds = parent?.kids ?? [];

  const {
    list: comments,
    pageInfo,
    totalCount,
  } = await commentService.getCommentsByIds(commentIds, args);

  return {
    edges: comments.map(async (comment) => ({
      cursor: Buffer.from(`${comment?.id}`).toString("base64"),
      node: comment,
    })),
    nodes: comments,
    pageInfo,
    totalCount: totalCount,
  };
};

const resolvers = (services: IServices) => ({
  Query: {
    Comment: resolveComment(services),
    CommentList: resolveCommentList(services),
  },
  Comment: {
    author: resolveUser(services),
    // comments: resolveComment(services),
  },
});

export default resolvers;
