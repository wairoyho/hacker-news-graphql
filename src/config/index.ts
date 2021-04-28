import convict from "convict";
import convictFormatValidator from "convict-format-with-validator";
import dotenv from "dotenv";
import path from "path";

import configSchema, { ConfigSchema } from "./schema";

dotenv.config();

convict.addFormats(convictFormatValidator);
const config = convict(configSchema);

const stage = config.get("stage");
const stageConfigPath = path.join(__dirname, `config.${stage}`);
const stageConfig = require(stageConfigPath).default;

config.load(stageConfig);

console.log(config.toString());

export type IConfig = convict.Config<ConfigSchema>;

export default config;
