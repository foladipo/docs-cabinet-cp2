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

        // Output, by bcryptjs, of hashSync('1Very&&Hard$@', 10).
        password: '$2a$10$ygpgO9WFB3Qf7AEdgDmYe.DfwcI2Ve63NHkqNdgpFID9u0hQTufvu',
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
