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

        // Output, by bcryptjs, of hashSync('Very&&Hard$@', 5).
        password: '$2a$05$GEmF6Qhjt2u0M4bP2izMAunEMU6HuZmb2rmOwh8EJsyItyH9lWcq2',
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
