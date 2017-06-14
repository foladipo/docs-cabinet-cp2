import Sequelize from 'sequelize';
import initSequelize from '../util/initSequelize';

const sequelize = initSequelize();
const User = sequelize.define('User', {
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  },
  username: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  roleId: {
    type: Sequelize.INTEGER
  },
  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt: {
    type: Sequelize.DATE
  }
}, {
  freezeTableName: true
});

export default User;
