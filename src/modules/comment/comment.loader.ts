import DataLoader from "dataloader";
import CommentRepository from "./comment.repository";

// const getItems = async (keys) => {
//   const result = await Promise.all(
//     keys.map(async (key) => {
//       const resp = await HackerNewsService.getItem(key);
//       return resp.data;
//     })
//   );

//   return keys.map(
//     (key) =>
//       result.find(({ id }) => key == id) || new Error(`No result for ${key}`)
//   );
// };

// export const commentLoader = new DataLoader((keys) => getItems(keys));

const commentLoader = (
  commentRepository: CommentRepository
): DataLoader<any, any, any> =>
  new DataLoader(async (keys) => await commentRepository.getComments(keys));

export default commentLoader;
