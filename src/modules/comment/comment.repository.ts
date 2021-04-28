import { Comment } from "./comment.entity";

class CommentRepository {
  apiClient;
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async getItem(itemId: string): Promise<Comment> {
    const res = await this.apiClient.get(`/item/${itemId}.json`);
    return res.data;
  }

  async getComment(commentId: string) {
    return this.getItem(commentId);
  }

  async getComments(commentIds: readonly any[]) {
    const result = await Promise.all(
      commentIds.map(async (commentId) => {
        const comment = await this.getComment(commentId);
        return comment;
      })
    );

    return commentIds.map(
      (key) =>
        result.find(({ id }) => key == id) || new Error(`No result for ${key}`)
    );
  }
}

export default CommentRepository;
