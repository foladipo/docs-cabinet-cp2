module.exports = {
  up: (queryInterface) => {
    const now = new Date();
    const timeStamp = now.toISOString();
    return queryInterface.bulkInsert('Role', [
      {
        id: 0,
        roleName: 'regular',
        createdAt: timeStamp,
        updatedAt: timeStamp
      },
      {
        id: 1,
        roleName: 'admin',
        createdAt: timeStamp,
        updatedAt: timeStamp
      }
    ]);
  },
  down: queryInterface =>
    // queryInterface.dropTable('User')
    //   .then(() => queryInterface.bulkDelete('Role', {
    //     id: [0, 1]
    //   }))
    queryInterface.bulkDelete('Role', {
      id: [0, 1]
    })
};
