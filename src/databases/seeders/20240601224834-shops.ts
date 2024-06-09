import { QueryInterface } from "sequelize";
import { shopOneId, shopTwoId, userFourId, userSevenId } from "../../types/uuid";

const shopOne = {
    id: shopOneId,
    name: "Paccy Shop 250",
    userId: userFourId,
    description: "Selling",
    createdAt: new Date(),
    updatedAt: new Date()
}

const shopTwo = {
    id: shopTwoId,
    name: "Paccy Shop 509",
    userId: userSevenId,
    description: "Selling",
    createdAt: new Date(),
    updatedAt: new Date()
}

export const up = async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert("shops", [shopOne, shopTwo]);
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("shops", {});
};