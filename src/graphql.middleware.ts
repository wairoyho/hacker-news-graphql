import { graphqlHTTP } from "express-graphql";
import path from "path";

import { loadSchemaSync } from "@graphql-tools/load";
import { addResolversToSchema } from "@graphql-tools/schema";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";

import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";

const loadResolver = (services) => {
  const resolversArray = loadFilesSync(
    path.join(__dirname, "./**/*.resolvers.*")
  );

  return mergeResolvers(resolversArray.map((item) => item(services)));
};

const loadSchema = () => {
  const schema = loadSchemaSync(
    path.join(__dirname, "./modules/**/*.schema.graphql"),
    {
      loaders: [new GraphQLFileLoader()],
    }
  );

  return schema;
};

// Add resolvers to the schema
const schemaWithResolvers = (services) =>
  addResolversToSchema({
    schema: loadSchema(),
    resolvers: loadResolver(services),
  });

const middleware = (services) =>
  graphqlHTTP((req) => ({
    schema: schemaWithResolvers(services),
    graphiql: true,
    context: {
      req,
      // dataLoader: {
      //   commentLoader,
      //   storyLoader: createStoryLoader(),
      //   userLoader,
      // },
      // modules: {
      //   story: {
      //     service: StoryService,
      //     // repository: new StoryRepoFactory(),
      //     // repository: new (createStoryRepository(FetchDriverInstance))(),
      //     // repository: {
      //     //   getStoryList: createStoryRepository(FetchDriverInstance),
      //     // },
      //   },
      // },
    },
  }));

export default middleware;
