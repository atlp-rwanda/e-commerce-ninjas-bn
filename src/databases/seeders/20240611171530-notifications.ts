import { QueryInterface } from "sequelize";
import { notificationOneId, notificationTwoId, notificationThreeId, userOneId, userTwoId, userSevenId, userThirteenId, notificationFourId, notificationFiveId, notificationSixId, notificationSevenId, notificationEightId, notificationNineId, notificationTenId, notificationElevenId, notificationTwelveId } from "../../types/uuid";

const notificationOne = {
    id: notificationOneId,
    userId: userOneId,
    message: "Hello There!",
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date()
}

const notificationTwo = {
    id: notificationTwoId,
    userId: userTwoId,
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

const notificationFour = {
    id: notificationFourId,
    userId: userThirteenId,
    message: "Hi There!",
    isRead: true,
    createdAt: new Date(),
    updatedAt: new Date()
}

const notificationFive = {
    id: notificationFiveId,
    userId: userThirteenId,
    message: "Hello!",
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date()
}

const notificationSix = {
    id: notificationSixId,
    userId: userThirteenId,
    message: "Good morning!",
    isRead: true,
    createdAt: new Date(),
    updatedAt: new Date()
}

const notificationSeven = {
    id: notificationSevenId,
    userId: userThirteenId,
    message: "Good evening!",
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date()
}

const notificationEight = {
    id: notificationEightId,
    userId: userThirteenId,
    message: "Good night!",
    isRead: true,
    createdAt: new Date(),
    updatedAt: new Date()
}

const notificationNine = {
    id: notificationNineId,
    userId: userThirteenId,
    message: "How are you today?",
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date()
}

const notificationTen = {
    id: notificationTenId,
    userId: userThirteenId,
    message: "I'm doing well, thank you!",
    isRead: true,
    createdAt: new Date(),
    updatedAt: new Date()
}

const notificationEleven = {
    id: notificationElevenId,
    userId: userThirteenId,
    message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum ",
    isRead: true,
    createdAt: new Date(),
    updatedAt: new Date()
}

const notificationTwelve = {
    id: notificationTwelveId,
    userId: userThirteenId,
    message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas  ",
    isRead: true,
    createdAt: new Date(),
    updatedAt: new Date()
}

export const up = async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert("notifications", [notificationOne, notificationTwo, notificationThree, notificationFour, notificationFive, notificationSix, notificationSeven, notificationEight, notificationNine, notificationTen, notificationEleven, notificationTwelve]);
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("notifications", {});
};