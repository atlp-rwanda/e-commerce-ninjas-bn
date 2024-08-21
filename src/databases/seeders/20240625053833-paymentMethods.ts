import { QueryInterface } from "sequelize";
import { paymentSixId, userFiveTeenId, paymentFiveId, userFourTeenId, paymentFourId, userSevenId, paymentThreeId, userSixId, paymentTwoId, userFiveId, paymentOneId, userFourId } from "../../types/uuid";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert("paymentMethods", [
      {
        id:paymentOneId,
        userId:userFourId,
        bankPayment: true,
        mobilePayment: false,
        bankAccount: "2345r678908765432",
        bankName: "Equity",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id:paymentTwoId,
        userId:userFiveId,
        bankPayment: true,
        mobilePayment: false,
        bankAccount: "2345r678908765432",
        bankName: "Equity",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id:paymentThreeId,
        userId:userSixId,
        bankPayment: true,
        mobilePayment: false,
        bankAccount: "2345r678908765432",
        bankName: "Equity",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id:paymentFourId,
        userId:userSevenId,
        bankPayment: true,
        mobilePayment: false,
        bankAccount: "2345r678908765432",
        bankName: "Equity",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id:paymentFiveId,
        userId:userFourTeenId,
        bankPayment: true,
        mobilePayment: false,
        bankAccount: "2345r678908765432",
        bankName: "Equity",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id:paymentSixId,
        userId:userFiveTeenId,
        bankPayment: true,
        mobilePayment: false,
        bankAccount: "2345r678908765432",
        bankName: "Equity",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("paymentMethods", null, {});
  }
};