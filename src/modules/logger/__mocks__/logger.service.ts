import pino from "pino";

jest.mock("pino");

const Logger = ({ config }: IServices): pino.Logger => {
  return pino({
    level: config.get("logger.level"),
  });
};

export default Logger;
