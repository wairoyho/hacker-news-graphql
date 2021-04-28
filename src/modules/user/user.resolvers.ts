export const resolveUser = ({ userService, logger }: IServices) => async (
  parent,
  args,
  ctx,
  info
) => {
  const { id } = args;

  const userId = parent?.by ?? id;
  logger.debug("userId", userId);

  const user = await userService.getUserById(userId);

  return user;
};

const resolvers = (services: IServices) => ({
  Query: {
    User: resolveUser(services),
  },
});

export default resolvers;
