const stage = {
  stage: "test",
  logger: {
    level: "silent",
  },
  service: {
    hackerNews: {
      apiBaseUrl: "http://localhost",
    },
    hackerNewsSearch: {
      apiBaseUrl: "http://localhost",
    },
  },
};

const mapDotNotationToObject = (notation: string) =>
  notation.split(".").reduce((acc, val) => acc[val] ?? {}, stage) ?? "";

const config = {
  get: (s) => mapDotNotationToObject(s),
};

export default config;
