/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (
    queryInterface: {
      bulkInsert: (
        arg0: string,
        arg1: {
          id: number;
          firstName: string;
          lastName: string;
          email: string;
          createdAt: Date;
          updatedAt: Date;
        }[]
      ) => any;
    },
    Sequelize: any
  ) => {
    // Add multiple users to database
    return queryInterface.bulkInsert("users", [
      {
        id: 3,
        firstName: "Saddock",
        lastName: "Kabandana",
        email: "saddock@gmail.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        firstName: "David",
        lastName: "Tuyishime",
        email: "tuyishime@gmail.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        firstName: "Aime",
        lastName: "Patrick",
        email: "aimepatrick@gmail.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (
    queryInterface: { bulkDelete: (arg0: string, arg1: null, arg2: {}) => any },
    Sequelize: any
  ) => {
    // Remove all users from database
    return queryInterface.bulkDelete("users", null, {});
  },
};
