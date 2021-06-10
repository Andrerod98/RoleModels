module.exports = {
  roots: ["<rootDir>", "<rootDir>/src"],
  testMatch: ["**/?(*.)+(spec|test).[t]s"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js?)$": "babel-jest",
  },
  modulePaths: ["<rootDir>"],
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  setupFilesAfterEnv: ["./setup.js"],
};
