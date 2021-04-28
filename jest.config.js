const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig.json");

const moduleNameMapper = pathsToModuleNameMapper(compilerOptions.paths, {
  prefix: "<rootDir>/",
});

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/"],
  collectCoverageFrom: ["src/**/*.ts"],
  coveragePathIgnorePatterns: ["<rootDir>/.*/__fixtures__"],
  moduleNameMapper,
  modulePaths: ["<rootDir>/src"],
  modulePathIgnorePatterns: ["<rootDir>/.*/__mocks__"],
};
