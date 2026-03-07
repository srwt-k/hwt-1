import type { Config } from "jest";

const config: Config = {
  preset:             "ts-jest",
  testEnvironment:    "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",   // match your tsconfig paths
  },
};

export default config;