import { QueryInterface } from "sequelize";
import { shopFiveId, shopFourId, shopOneId, shopSixId, shopThreeId, shopTwoId, userFiveId, userFiveTeenId, userFourId, userFourTeenId, userSevenId, userSixId } from "../../types/uuid";

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

const shopThree = {
    id: shopThreeId,
    name: "Shoes Shop 509",
    userId: userFourTeenId,
    description: "Selling",
    createdAt: new Date(),
    updatedAt: new Date()
}
const shopFour = {
    id: shopFourId,
    name: "electronic Shop 509",
    userId: userSixId,
    description: "Selling",
    createdAt: new Date(),
    updatedAt: new Date()
}
const shopFive = {
    id: shopFiveId,
    name: "Shop 509",
    userId: userFiveId,
    description: "Selling",
    createdAt: new Date(),
    updatedAt: new Date()
}
const shopSix = {
    id: shopSixId,
    name: "electronics Shop 509",
    userId: userFiveTeenId,
    description: "Selling",
    createdAt: new Date(),
    updatedAt: new Date()
}


export const up = async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert("shops", [shopOne, shopTwo,shopThree,shopFour, shopFive, shopSix]);
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("shops", {});
};