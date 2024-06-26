"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const products_1 = __importDefault(require("../databases/models/products"));
const sequelize_1 = require("sequelize");
const sendEmail_1 = require("../services/sendEmail");
const shops_1 = __importDefault(require("../databases/models/shops"));
const users_1 = __importDefault(require("../databases/models/users"));
const updateExpiredProducts = async () => {
    try {
        const expiredProducts = await products_1.default.findAll({
            where: {
                expiryDate: { [sequelize_1.Op.lt]: new Date() },
                expired: false
            },
            attributes: ["id", "shopId", "name"]
        });
        for (const product of expiredProducts) {
            await product.update({
                expired: true,
                status: "unavailable"
            });
        }
        const shopIds = expiredProducts.map((product) => product.shopId);
        const shops = await shops_1.default.findAll({
            where: {
                id: {
                    [sequelize_1.Op.in]: shopIds
                }
            },
            attributes: ["id", "userId"]
        });
        const userIds = shops.map((shop) => shop.userId);
        const users = await users_1.default.findAll({
            where: {
                id: {
                    [sequelize_1.Op.in]: userIds
                }
            },
            attributes: ["id", "email", "firstName"]
        });
        const userMap = {};
        users.forEach((user) => {
            userMap[user.id] = {
                email: user.email,
                firstName: user.firstName
            };
        });
        for (const product of expiredProducts) {
            const UserShop = shops.find((shop) => shop.id === product.shopId);
            if (UserShop) {
                const user = userMap[UserShop.userId];
                if (user) {
                    await (0, sendEmail_1.sendEmail)(user.email, "Product Expired", `Dear ${user.firstName}, your product ${product.name} has expired and now is unavailable.`);
                }
            }
        }
    }
    catch (error) {
        console.error("Error updating expired products:", error.message);
    }
};
exports.default = updateExpiredProducts;
//# sourceMappingURL=updateExpiredProducts.js.map