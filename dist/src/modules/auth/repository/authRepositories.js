"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
const sequelize_1 = require("sequelize");
const models_1 = __importDefault(require("../../../databases/models"));
const createUser = async (body) => {
    return await models_1.default.Users.create({ ...body, role: "buyer" });
};
const findUserByAttributes = async (key, value) => {
    return await models_1.default.Users.findOne({ where: { [key]: value } });
};
const updateUserByAttributes = async (updatedKey, updatedValue, whereKey, whereValue) => {
    await models_1.default.Users.update({ [updatedKey]: updatedValue, passwordUpdatedAt: new Date() }, { where: { [whereKey]: whereValue } });
    return await findUserByAttributes(whereKey, whereValue);
};
const createSession = async (body) => {
    return await models_1.default.Sessions.create(body);
};
const findSessionByAttributes = async (key, value) => {
    return await models_1.default.Sessions.findOne({ where: { [key]: value } });
};
const findSessionByUserIdAndToken = async (userId, token) => {
    return await models_1.default.Sessions.findOne({ where: { token, userId } });
};
const findTokenByDeviceIdAndUserId = async (device, userId) => {
    const session = await models_1.default.Sessions.findOne({ where: { device, userId } });
    return session.token;
};
const destroySessionByAttribute = async (destroyKey, destroyValue, key, value) => {
    return await models_1.default.Sessions.destroy({
        where: { [destroyKey]: destroyValue, [key]: value },
    });
};
const findSessionByUserIdOtp = async (userId, otp) => {
    return await models_1.default.Sessions.findOne({
        where: {
            userId: userId,
            otp: otp,
            otpExpiration: { [sequelize_1.Op.gt]: new Date() }
        }
    });
};
exports.default = {
    createUser,
    createSession,
    findUserByAttributes,
    findSessionByAttributes,
    findSessionByUserIdAndToken,
    findTokenByDeviceIdAndUserId,
    updateUserByAttributes,
    destroySessionByAttribute,
    findSessionByUserIdOtp
};
//# sourceMappingURL=authRepositories.js.map