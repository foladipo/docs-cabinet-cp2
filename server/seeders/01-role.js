module.exports = {
  up: (queryInterface) => {
    const now = new Date();
    const timeStamp = now.toISOString();
    queryInterface.bulkInsert('Role', [
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
    queryInterface.bulkDelete('Role', {
      id: [0, 1]
    })
};
