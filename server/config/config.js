const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_DB_USERNAME,
    password: process.env.POSTGRES_DB_PASSWORD,
    host: process.env.POSTGRES_DB_HOST,
    port: process.env.POSTGRES_DB_PORT,
    dialect: 'postgres'
  },
  test: {
    use_env_variable: 'DB_URL_TRAVIS',
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'DB_URL',
    dialect: 'postgres'
  }
};
