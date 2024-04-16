// relay.config.js
module.exports = {
  // ...
  // Configuration options accepted by the `relay-compiler` command-line tool and `babel-plugin-relay`.
  src: './',
  schema: '../udon/src/graphql/__generated__/main.graphql',
  artifactDirectory: './relay-types/',
  language: 'typescript',
  noFutureProofEnums: true,
  exclude: [
    '**/node_modules/**',
    '**/__mocks__/**',
    '**/__generated__/**',
    '**/relay-types/**',
  ],
};
