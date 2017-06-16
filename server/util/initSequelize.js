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
    const envVariableName = currentConfig.use_env_variable;
    sequelize = new Sequelize(process.env[envVariableName], currentConfig);
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
