import {
  parseWildcardsInUrl,
  displayUrlToWildcardUrl,
  wildcardUrlToDisplayUrl,
} from './wildcardUrlHelpers';

test.each([
  [
    'https://app.catalyst.io/home?layoutId=016f8206-ab0d-496e-827b-36bdc1e089fe',
    'https://app.catalyst.io/home\\?layoutId=[^&]+',
  ],
  [
    'https://app.catalyst.io/home?layoutId=somethingelse',
    'https://app.catalyst.io/home\\?layoutId=somethingelse',
  ],
  [
    'https://app.catalyst.io/home/016f8206-ab0d-496e-827b-36bdc1e089fe',
    'https://app.catalyst.io/home/[^/]+',
  ],
  [
    'https://app.catalyst.io/home?layoutId=tasks&accountId=eb285265-c52c-4587-b41f-e27499a9b377',
    'https://app.catalyst.io/home\\?layoutId=tasks&accountId=[^&]+',
  ],
  [
    'https://app.catalyst.io/templates/d80ce038-1c61-43f0-96cc-e024e91c6a86?layoutId=tasks',
    'https://app.catalyst.io/templates/[^/]+\\?layoutId=tasks',
  ],
  [
    'https://app.catalyst.io/data/folders/5dfaf0cf-f0e4-4914-a65d-fe5bfe9587a6?layoutId=tasks&noteIds=83b19a34-cb34-4230-bee1-ca3e1adb7eb4',
    'https://app.catalyst.io/data/folders/[^/]+\\?layoutId=tasks&noteIds=[^&]+',
  ],
  [
    'https://app.catalyst.io/data/folders/5dfaf0cf-f0e4-4914-a65d-fe5bfe9587a6?layoutId=tasks&noteIds=83b19a34-cb34-4230-bee1-ca3e1adb7eb4#nothing',
    'https://app.catalyst.io/data/folders/[^/]+\\?layoutId=tasks&noteIds=[^&]+#nothing',
  ],
  [
    'https://app.catalyst.io/data/folders/5dfaf0cf-f0e4-4914-a65d-fe5bfe9587a6?layoutId=tasks&noteIds=83b19a34-cb34-4230-bee1-ca3e1adb7eb4#someeb285265-c52c-4587-b41f-e27499a9b377thing',
    'https://app.catalyst.io/data/folders/[^/]+\\?layoutId=tasks&noteIds=[^&]+#some.+thing',
  ],
  [
    'https://app-staging.thnks.com/#/send-thnks/categories/5dfaf0cf-f0e4-4914-a65d-fe5bfe9587a6?country=US',
    'https://app-staging.thnks.com/#/send-thnks/categories/[^/]+\\?country=US',
  ],
  [
    'https://app-staging.thnks.com/#/send-thnks/categories/5dfaf0cf-f0e4-4914-a65d-fe5bfe9587a6/something?country=US',
    'https://app-staging.thnks.com/#/send-thnks/categories/[^/]+/something\\?country=US',
  ],
  [
    'https://app-staging.thnks.com/#/send-thnks/categories?country=5dfaf0cf-f0e4-4914-a65d-fe5bfe9587a6',
    'https://app-staging.thnks.com/#/send-thnks/categories\\?country=[^&]+',
  ],
  [
    'https://app-staging.thnks.com/#/send-thnks/categories/?country=5dfaf0cf-f0e4-4914-a65d-fe5bfe9587a6&state=CA',
    'https://app-staging.thnks.com/#/send-thnks/categories/\\?country=[^&]+&state=CA',
  ],
])('parseWildcardsInUrl', (url, wildcard) => {
  expect(parseWildcardsInUrl(url)).toBe(wildcard);
});

test.each([
  [
    'https://app.catalyst.io/home?layoutId=*',
    'https://app.catalyst.io/home\\?layoutId=[^&]+',
  ],
  [
    'https://app.catalyst.io/home?layoutId=somethingelse',
    'https://app.catalyst.io/home\\?layoutId=somethingelse',
  ],
  ['https://app.catalyst.io/home/*', 'https://app.catalyst.io/home/?.*'],
  [
    'https://app.catalyst.io/home/*/something',
    'https://app.catalyst.io/home/[^/]+/something',
  ],
  [
    'https://app.catalyst.io/home?layoutId=tasks&accountId=*',
    'https://app.catalyst.io/home\\?layoutId=tasks&accountId=[^&]+',
  ],
  [
    'https://app.catalyst.io/templates/*?layoutId=tasks',
    'https://app.catalyst.io/templates/[^/]+\\?layoutId=tasks',
  ],
  [
    'https://app.catalyst.io/data/folders/*?layoutId=tasks&noteIds=*',
    'https://app.catalyst.io/data/folders/[^/]+\\?layoutId=tasks&noteIds=[^&]+',
  ],
  [
    'https://app.catalyst.io/data/folders/*?layoutId=tasks&noteIds=*#nothing',
    'https://app.catalyst.io/data/folders/[^/]+\\?layoutId=tasks&noteIds=[^&]+#nothing',
  ],
  [
    'https://app.catalyst.io/data/folders/*?layoutId=tasks&noteIds=*#some*thing',
    'https://app.catalyst.io/data/folders/[^/]+\\?layoutId=tasks&noteIds=[^&]+#some.+thing',
  ],
  [
    'https://app-staging.thnks.com/#/send-thnks/categories/*?country=US',
    'https://app-staging.thnks.com/#/send-thnks/categories/[^/]+\\?country=US',
  ],
  [
    'https://app-staging.thnks.com/#/send-thnks/categories/*/something?country=US',
    'https://app-staging.thnks.com/#/send-thnks/categories/[^/]+/something\\?country=US',
  ],
  [
    'https://app-staging.thnks.com/#/send-thnks/categories?country=*',
    'https://app-staging.thnks.com/#/send-thnks/categories\\?country=[^&]+',
  ],
  [
    'https://app-staging.thnks.com/#/send-thnks/categories/?country=*&state=CA',
    'https://app-staging.thnks.com/#/send-thnks/categories/\\?country=[^&]+&state=CA',
  ],
])('displayUrlToWildcardUrl', (url, wildcard) => {
  expect(displayUrlToWildcardUrl(url)).toBe(wildcard);
});

test.each([
  [
    'https://app.catalyst.io/home\\?layoutId=[^&]+',
    'https://app.catalyst.io/home?layoutId=*',
  ],
  [
    'https://app.catalyst.io/home\\?layoutId=somethingelse',
    'https://app.catalyst.io/home?layoutId=somethingelse',
  ],
  ['https://app.catalyst.io/home/?.*', 'https://app.catalyst.io/home/*'],
  [
    'https://app.catalyst.io/home/[^/]+/something',
    'https://app.catalyst.io/home/*/something',
  ],
  [
    'https://app.catalyst.io/home\\?layoutId=tasks&accountId=[^&]+',
    'https://app.catalyst.io/home?layoutId=tasks&accountId=*',
  ],
  [
    'https://app.catalyst.io/templates/[^/]+\\?layoutId=tasks',
    'https://app.catalyst.io/templates/*?layoutId=tasks',
  ],
  [
    'https://app.catalyst.io/data/folders/[^/]+\\?layoutId=tasks&noteIds=[^&]+',
    'https://app.catalyst.io/data/folders/*?layoutId=tasks&noteIds=*',
  ],
  [
    'https://app.catalyst.io/data/folders/[^/]+\\?layoutId=tasks&noteIds=[^&]+#nothing',
    'https://app.catalyst.io/data/folders/*?layoutId=tasks&noteIds=*#nothing',
  ],
  [
    'https://app.catalyst.io/data/folders/[^/]+\\?layoutId=tasks&noteIds=[^&]+#some.+thing',
    'https://app.catalyst.io/data/folders/*?layoutId=tasks&noteIds=*#some*thing',
  ],
  [
    'https://app-staging.thnks.com/#/send-thnks/categories/[^/]+\\?country=US',
    'https://app-staging.thnks.com/#/send-thnks/categories/*?country=US',
  ],
  [
    'https://app-staging.thnks.com/#/send-thnks/categories/[^/]+/something\\?country=US',
    'https://app-staging.thnks.com/#/send-thnks/categories/*/something?country=US',
  ],
  [
    'https://app-staging.thnks.com/#/send-thnks/categories\\?country=[^&]+',
    'https://app-staging.thnks.com/#/send-thnks/categories?country=*',
  ],
  [
    'https://app-staging.thnks.com/#/send-thnks/categories/\\?country=[^&]+&state=CA',
    'https://app-staging.thnks.com/#/send-thnks/categories/?country=*&state=CA',
  ],
])('wildcardUrlToDisplayUrl', (url, wildcard) => {
  expect(wildcardUrlToDisplayUrl(url)).toBe(wildcard);
});
