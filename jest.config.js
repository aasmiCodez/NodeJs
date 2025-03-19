module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
      moduleNameMapper: {
        "^@config/(.*)$": "<rootDir>/src/config/$1",
        "^@utils/(.*)$": "<rootDir>/src/utils/$1"
      },
  };
  