import DataLoader from "dataloader";
import UserRepository from "./user.repository";

// import HackerNewsService from "../../services/HackerNewsApi";
// import UserRepository from "./user.repository";

// const getUsers = async (keys) => {
//   const result = await Promise.all(
//     keys.map(async (key) => {
//       const resp = await HackerNewsService.getUser(key);
//       return resp.data;
//     })
//   );

//   return keys.map(
//     (key) =>
//       result.find(({ id }) => key == id) || new Error(`No result for ${key}`)
//   );
// };

// export const userLoader = new DataLoader((keys) => getUsers(keys));

const userLoader = (userRepository): DataLoader<any, any, any> =>
  new DataLoader(async (keys) => await userRepository.getUsers(keys));

export default userLoader;
