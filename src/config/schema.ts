export type ConfigSchema = {
  stage: string;
  logger: string;
  service: {
    hackerNews: {
      apiBaseUrl: string;
    };
    hackerNewsSearch: {
      apiBaseUrl: string;
    };
  };
};

const schema = {
  stage: {
    env: "STAGE",
    format: ["local", "development", "test", "staging", "production"],
    doc: "application stage",
    default: "local",
  },
  logger: {
    level: {
      env: "LOGGER_LEVEL",
      format: ["fatal", "error", "warn", "info", "debug", "trace", "silent"],
      default: "info",
    },
  },
  service: {
    hackerNews: {
      apiBaseUrl: {
        env: "HACKER_NEW_SERVICE_API_BASE_URL",
        format: "url",
        default: null,
      },
    },
    hackerNewsSearch: {
      apiBaseUrl: {
        env: "HACKER_NEW_SEARCH_SERVICE_API_BASE_URL",
        formart: "url",
        default: null,
      },
    },
  },
};

export default schema;
