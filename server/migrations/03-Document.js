module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Document', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      docContent: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      access: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          // will only allow letters
          is: ['[a-z]', 'i'],
          isIn: {
            args: [['public', 'private', 'role']]
          }
        },
      },

      // Used Sequelize.STRING and not Sequelize.ARRAY to make this project
      // database dialect-agnostic, because, in Sequelize, the latter is
      // only available for Postgres.
      categories: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tags: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
          model: 'User',
          key: 'id'
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    }),
  down: queryInterface => queryInterface.dropTable('Document')
};
