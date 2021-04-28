import pino from "pino";

export type ILogger = pino.Logger;

const Logger = ({ config }: IServices): pino.Logger => {
  return pino({
    level: config.get("logger.level"),
  });
};

export default Logger;
