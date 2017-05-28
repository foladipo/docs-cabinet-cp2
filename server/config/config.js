const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    username: process.env.POSTGRES_DB_USERNAME,
    password: process.env.POSTGRES_DB_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_DB_HOST,
    port: process.env.POSTGRES_DB_PORT,
    dialect: 'postgres'
  },
  test: {
    use_env_variable: 'DATABASE_URL_TRAVIS',
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres'
  }
};
