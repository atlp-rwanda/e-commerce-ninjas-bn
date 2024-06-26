"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cartProducts_1 = __importDefault(require("./cartProducts"));
const carts_1 = __importDefault(require("./carts"));
const products_1 = __importDefault(require("./products"));
const shops_1 = __importDefault(require("./shops"));
const users_1 = __importDefault(require("./users"));
const orders_1 = __importDefault(require("./orders"));
const sessions_1 = __importDefault(require("./sessions"));
const chats_1 = __importDefault(require("./chats"));
const wishLists_1 = __importDefault(require("./wishLists"));
const db = {
    CartProducts: cartProducts_1.default,
    Carts: carts_1.default,
    Products: products_1.default,
    Shops: shops_1.default,
    Users: users_1.default,
    Orders: orders_1.default,
    Sessions: sessions_1.default,
    Chats: chats_1.default,
    wishLists: wishLists_1.default
};
Object.values(db).forEach(model => {
    if (model.associate) {
        // @ts-expect-error: Model association method expects a different type signature
        model.associate(db);
    }
});
exports.default = db;
//# sourceMappingURL=index.js.map