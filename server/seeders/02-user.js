module.exports = {
  up: (queryInterface) => {
    const now = new Date();
    const timeStamp = now.toISOString();
    return queryInterface.bulkInsert('User', [
      {
        id: 0,
        firstName: 'Lagbaja',
        lastName: 'Anonymous',
        username: 'foo@example.com',

        // Output, by bcryptjs, of hashSync('Very&&Hard$@', 10).
        password: '$2a$10$jk5F81NcjzUp/F51qShkjus4qUfRSMTFlkMx4l62EPp7teNoVaOyO',
        roleId: 0,
        createdAt: timeStamp,
        updatedAt: timeStamp
      }
    ]);
  },
  down: queryInterface =>
    queryInterface.bulkDelete('User', {
      id: [0]
    })
};
