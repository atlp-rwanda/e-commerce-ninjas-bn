"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const models_1 = __importDefault(require("../../../databases/models"));
const getAllUsers = async () => {
    return models_1.default.Users.findAll();
};
const updateUserProfile = async (user, id) => {
    await models_1.default.Users.update({ ...user }, { where: { id }, returning: true });
    const updateUser = await models_1.default.Users.findOne({ where: { id } });
    return updateUser;
};
const postChatMessage = async (userId, message) => {
    const chat = await models_1.default.Chats.create({ userId, message });
    const fullChat = await models_1.default.Chats.findOne({
        where: { id: chat.id },
        include: [
            {
                model: models_1.default.Users,
                as: "user",
                attributes: ["id", "firstName", "lastName", "email", "role"]
            }
        ]
    });
    return fullChat.toJSON();
};
const getAllPastChats = async () => {
    const chats = await models_1.default.Chats.findAll({
        limit: 50,
        order: [["createdAt", "ASC"]],
        include: [
            {
                model: models_1.default.Users,
                as: "user",
                attributes: ["id", "firstName", "lastName", "email", "role"]
            }
        ]
    });
    return chats;
};
exports.default = { getAllUsers, updateUserProfile, postChatMessage, getAllPastChats };
//# sourceMappingURL=userRepositories.js.map