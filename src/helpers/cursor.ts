export const decodeCursor = (cursor: string) =>
  Buffer.from(cursor, "base64").toString("ascii");

export const encodeToCursor = (id: any, prefix = "") => {
  return Buffer.from(
    prefix ? `${prefix.toLowerCase()}:${id.toString()}` : id.toString()
  ).toString("base64");
};

export interface IPaginationArguments {
  first: number;
  last: number;
  before: string;
  after: string;
}

export const destructureCursor = (cursor) => decodeCursor(cursor).split(":");

export const getSelectedList = (list: any[], args: IPaginationArguments) => {
  const { before, after, first, last } = args;
  let result = list;

  if (first && last)
    throw new Error(
      "Passing both `first` and `last` to paginate the connection is not supported."
    );

  if (before) {
    const id = destructureCursor(before).slice(-1)[0];
    result = result.slice(0, list.indexOf(parseInt(id)));
  }
  if (after) {
    const id = destructureCursor(after).slice(-1)[0];
    result = result.slice(list.indexOf(parseInt(id)) + 1);
  }
  if (first) result = result.slice(0, first);
  if (last) result = result.slice(0 - last);

  let pageInfo: any = {
    hasNextPage: result.length
      ? list.indexOf(result[result.length - 1]) < list.length - 1
      : false,
    hasPreviousPage: list.indexOf(result[0]) > 0,
  };

  return { list: result, pageInfo };
};
