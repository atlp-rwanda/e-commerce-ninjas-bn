import { QueryInterface } from "sequelize";
import { addressOneId, addressTwoId, userTwoId, userFourId } from "../../types/uuid";

const addressOne = {
    id: addressOneId,
    userId: userTwoId,
    province: "Kigali",
    district: "Nyarugenge",
    sector: "Gitega",
    street: "KN 123 St",
    createdAt: new Date(),
    updatedAt: new Date()
}

const addressTwo = {
    id: addressTwoId,
    userId: userFourId,
    province: "Kigali",
    district: "Kicukiro",
    sector: "Gatenga",
    street: "KK 456 St",
    createdAt: new Date(),
    updatedAt: new Date()
}

export const up = async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert("addresses", [addressOne, addressTwo ]);
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("addresses", {});
};