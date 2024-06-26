import { QueryInterface } from "sequelize";
import { notificationOneId, notificationTwoId, notificationThreeId, userFourId, userSevenId } from "../../types/uuid";

const notificationOne = {
    id: notificationOneId,
    userId: userFourId,
    message: "Hello There!",
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date()
}

const notificationTwo = {
    id: notificationTwoId,
    userId: userSevenId,
    message: "Hey There!",
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date()
}

const notificationThree = {
    id: notificationThreeId,
    userId: userSevenId,
    message: "Good afternoon!",
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date()
}

export const up = async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert("notifications", [notificationOne, notificationTwo, notificationThree]);
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("notifications", {});
};