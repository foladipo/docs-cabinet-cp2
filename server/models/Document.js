import Sequelize from 'sequelize';
import initSequelize from '../util/initSequelize';

const sequelize = initSequelize();
const Document = sequelize.define('Document', {
  title: {
    type: Sequelize.STRING
  },
  docContent: {
    type: Sequelize.TEXT
  },
  access: {
    type: Sequelize.STRING,
    validate: {
      is: ['[a-z]', 'i'],
      isIn: {
        args: [['public', 'private', 'role']],
        msg: 'You must specify the access level of your'
          + ' document as either \'public\', \'private\' or \'role\'.'
      }
    },
  },
  categories: {
    type: Sequelize.STRING
  },
  tags: {
    type: Sequelize.STRING
  },
  createdBy: {
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

export default Document;
