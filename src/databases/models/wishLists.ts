/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable comma-dangle */
/* eslint-disable require-jsdoc */
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../config/db.config";
import Users from "./users";
import Products from "./products";

export interface wishListAttributes {
    id: string;
    userId: string;
    productId: string;
}

class wishLists extends Model<wishListAttributes> implements wishListAttributes {
    declare id: string;
    declare userId: string;
    declare productId: string;
    

    static associate() {
        wishLists.belongsTo(Users, { foreignKey: "userId", as: "Users" });
        wishLists.belongsTo(Products, { foreignKey: "productId", as: "products" });
    }
}

wishLists.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
          },
          userId: {
            type: new DataTypes.UUID,
            allowNull: false
        },
        productId: {
            type: new DataTypes.UUID,
            allowNull: false
        }
    },
        {
            sequelize: sequelizeConnection,
            tableName: "wishLists",
            timestamps: true,
            modelName: "WishLists"
        }       
    )
export default wishLists;
