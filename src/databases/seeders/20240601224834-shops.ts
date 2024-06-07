import { QueryInterface } from "sequelize";
import { shopOneId, userThreeId } from "../../types/uuid";

export const up = async (queryInterface: QueryInterface) => {
    const existingShop = await queryInterface.rawSelect("shops", {
        where: {
            id: shopOneId
        }
    }, ["id"]);

    if (!existingShop) {
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
    }
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("shops", { id: shopOneId }, {});
};
