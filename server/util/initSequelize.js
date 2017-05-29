import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Return an instance of Sequelize that has been initialized with the right
 * data like database name, host, port etc.
 * @return {Sequelize} - An instance of Sequelize.
 */
export default function initSequelize() {
  const sequelize = new Sequelize(
    process.env.POSTGRES_DB,
    process.env.POSTGRES_DB_USERNAME,
    process.env.POSTGRES_DB_PASSWORD,
    {
      host: process.env.POSTGRES_DB_HOST,
      port: process.env.POSTGRES_DB_PORT,
      dialect: 'postgres',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
    }
  );

  return sequelize;
}
