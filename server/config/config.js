const dotenv = require('dotenv');

dotenv.config();

let enableLogging;
if (process.env.SEQUELIZE_LOGGING === 'false') {
  enableLogging = false;
} else {
  enableLogging = true;
}

module.exports = {
  development: {
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_DB_USERNAME,
    password: process.env.POSTGRES_DB_PASSWORD,
    host: process.env.POSTGRES_DB_HOST,
    port: process.env.POSTGRES_DB_PORT,
    dialect: 'postgres',
    logging: enableLogging
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
