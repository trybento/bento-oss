const dotenv = require('dotenv');
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

dotenv.config({
  path: './env/test.env',
});

/** @type import('jest').Config */
module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/src',
  }),
  setupFiles: [
    '<rootDir>/src/utils/yup.ts',
    '<rootDir>/src/testUtils/setup.ts',
  ],
  roots: ['<rootDir>/src/'],
  bail: process.env.npm_lifecycle_event === 'test:watch' ? false : 5,
  maxWorkers: '100%',
  testTimeout: 10000,
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
