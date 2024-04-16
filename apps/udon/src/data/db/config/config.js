const dotenv = require('dotenv');

// Load any necessary environment variables from a file.
// This is only really useful for development.
dotenv.config({
  path: `./env/${process.env.NODE_ENV || 'development'}.env`,
});

module.exports = {
  development: {
    url: process.env.DATABASE_CONNECTION_POOL_URL || process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      searchPath: 'public',
      prependSearchPath: true,
    },
  },
  test: {
    url: process.env.DATABASE_CONNECTION_POOL_URL || process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      searchPath: 'public',
      prependSearchPath: true,
    },
  },
  staging: {
    url: process.env.DATABASE_CONNECTION_POOL_URL || process.env.DATABASE_URL,
    dialect: 'postgres',
    ssl: true,
    dialectOptions: {
      searchPath: 'public',
      prependSearchPath: true,
      ssl: {
        require: true,
        // Required for Heroku SSL
        // https://stackoverflow.com/questions/58965011/sequelizeconnectionerror-self-signed-certificate
        rejectUnauthorized: false,
      },
    },
  },
  production: {
    url: process.env.DATABASE_CONNECTION_POOL_URL || process.env.DATABASE_URL,
    dialect: 'postgres',
    ssl: true,
    dialectOptions: {
      searchPath: 'public',
      prependSearchPath: true,
      ssl: {
        require: true,
        // Required for Heroku SSL
        // https://stackoverflow.com/questions/58965011/sequelizeconnectionerror-self-signed-certificate
        rejectUnauthorized: false,
      },
    },
  },
};
