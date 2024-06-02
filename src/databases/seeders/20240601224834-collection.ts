import { QueryInterface } from "sequelize";
import { collectionOneId, collectionTwoId, userThreeId, userFourId } from "../../types/uuid";

export const up = async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert("collection", [
        {
            id: collectionOneId,
            name: "Shoes",
            sellerId: userThreeId,
            description: "Shoes",
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: collectionTwoId,
            name: "Electronics",
            sellerId: userFourId,
            description: "Electronics",
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]);
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("collection", null, {});
};
