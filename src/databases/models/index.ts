/* eslint-disable @typescript-eslint/no-explicit-any */
import { Sequelize } from "sequelize";
import sequelizeConnection from "../config/db.config";

import Users from "./users";
import Chats from "./chats";
import Products from "./products";
import Order from "./orders";
import Cart from "./cart";
import CartProduct from "./cartProducts";
import Sessions from "./session";
import Shops from "./shops";

const db: any = {};

db.Sequelize = Sequelize;
db.sequelize = sequelizeConnection;

db.Users = Users;
db.Chats = Chats;
db.Products = Products;
db.Order = Order;
db.Cart = Cart;
db.CartProduct = CartProduct;
db.Sessions = Sessions;
db.Shops = Shops;

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

export default db;
