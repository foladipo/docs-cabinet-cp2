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
        allowNull: false,
        unique: true,
      },
      docContent: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      access: {
        type: Sequelize.STRING,
        allowNull: false,
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
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        references: {
          model: 'User',
          key: 'id'
        }
      }
    }, {
      freezeTableName: true
    }),
  down: queryInterface => queryInterface.dropTable('Document')
};
