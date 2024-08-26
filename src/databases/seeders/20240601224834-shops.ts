import { QueryInterface } from "sequelize";
import { shopFiveId, shopFourId, shopOneId, shopSixId, shopThreeId, shopTwoId, userFiveId, userFiveTeenId, userFourId, userFourTeenId, userSevenId, userSixId } from "../../types/uuid";

const shopOne = {
    id: shopOneId,
    name: "GadgetHub 250",
    userId: userFourId,
    description: "Your one-stop shop for the latest gadgets and electronics.",
    createdAt: new Date(),
    updatedAt: new Date()
}

const shopTwo = {
    id: shopTwoId,
    name: "UrbanStyle Boutique",
    userId: userSevenId,
    description: "Bringing you the trendiest fashion and accessories in town.",
    createdAt: new Date(),
    updatedAt: new Date()
}

const shopThree = {
    id: shopThreeId,
    name: "SoleMates",
    userId: userFourTeenId,
    description: "Premium footwear for every step of your journey.",
    createdAt: new Date(),
    updatedAt: new Date()
}

const shopFour = {
    id: shopFourId,
    name: "TechNest",
    userId: userSixId,
    description: "Explore a world of cutting-edge electronics and accessories.",
    createdAt: new Date(),
    updatedAt: new Date()
}

const shopFive = {
    id: shopFiveId,
    name: "HomeEssentials",
    userId: userFiveId,
    description: "Everything you need to make your house a home.",
    createdAt: new Date(),
    updatedAt: new Date()
}

const shopSix = {
    id: shopSixId,
    name: "ElectroMart",
    userId: userFiveTeenId,
    description: "Your trusted source for all things electronic.",
    createdAt: new Date(),
    updatedAt: new Date()
}

export const up = async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert("shops", [shopOne, shopTwo, shopThree, shopFour, shopFive, shopSix]);
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("shops", {});
};