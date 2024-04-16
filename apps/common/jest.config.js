module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'esbuild-jest',
  },
  rootDir: './',
  modulePaths: ['<rootDir>'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
