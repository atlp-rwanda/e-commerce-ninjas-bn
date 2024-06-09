import { QueryInterface } from "sequelize";
import { shopOneId, userFourId } from "../../types/uuid";

export const up = async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert("shops", [
        {
            id: shopOneId,
            name: "Shoes",
            userId: userFourId,
            description: "Shoes",
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]);
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("shops", null, {});
};