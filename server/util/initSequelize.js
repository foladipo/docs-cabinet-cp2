import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import sequelizeConfig from '../config/config';

dotenv.config();

/**
 * Return an instance of Sequelize that has been initialized with appropriate
 * data like database name, host, port etc.
 * @return {Sequelize} - An instance of Sequelize.
 */
export default function initSequelize() {
  const currentEnv = process.env.NODE_ENV || 'development';

  let sequelize;
  const currentConfig = sequelizeConfig[currentEnv];
  if (currentEnv === 'test' || currentEnv === 'production') {
    const dbUri = currentConfig.dbUri;
    sequelize = new Sequelize(dbUri, currentConfig.options);
  } else {
    sequelize = new Sequelize(
      currentConfig.database,
      currentConfig.username,
      currentConfig.password,
      currentConfig.options
    );
  }

  return sequelize;
}
