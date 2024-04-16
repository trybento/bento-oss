module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  modulePaths: ['<rootDir/src'],
  transform: {
    '^.+\\.tsx?$': '@swc/jest',
  },
  moduleNameMapper: {
    '^.+\\.svg$': '<rootDir>/__mocks__/svgComponent.js',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!@medv)'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};
