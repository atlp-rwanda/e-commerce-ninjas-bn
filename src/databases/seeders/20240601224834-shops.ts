import { QueryInterface } from "sequelize";
import { shopOneId, userThreeId } from "../../types/uuid";

export const up = async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert("shops", [
        {
            id: shopOneId,
            name: "Shoes",
            userId: userThreeId,
            description: "Shoes",
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]);
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("shops", null, {});
};
