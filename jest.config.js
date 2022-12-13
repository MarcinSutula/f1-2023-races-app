module.exports = {
  // preset: "ts-jest",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)?$": "ts-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!(@arcgis|@stencil|@esri)/)"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupJest.ts"],
};
