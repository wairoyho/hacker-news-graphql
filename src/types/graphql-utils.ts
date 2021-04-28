import Express from "express";

export type Resolver = (
  parent: any,
  args: any,
  context: Context,
  info: any
) => any;

export interface Context {
  // redis: Redis;
  url: string;
  // session: Session;
  req: Express.Request;
  // userLoader: ReturnType<typeof userLoader>;
  [x: string]: any;
}

export interface ResolverMap {
  [key: string]: {
    [key: string]: Resolver;
  };
}
