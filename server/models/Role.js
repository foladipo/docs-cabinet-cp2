import Sequelize from 'sequelize';
import initSequelize from '../util/initSequelize';

const sequelize = initSequelize();
const Role = sequelize.define('Role', {
  roleName: {
    type: Sequelize.STRING
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

export default Role;
