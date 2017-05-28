module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Role', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true
      },
      roleName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    }),
  down: queryInterface =>
    queryInterface.dropTable('Role'),
};
