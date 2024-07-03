/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable comma-dangle */
/* eslint-disable require-jsdoc */
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../config/db.config";
import Users from "./users";
import wishListProducts from "./wishListProducts";
export interface wishListAttributes {
    id: string;
    userId: string;
}
class wishLists extends Model<wishListAttributes> implements wishListAttributes {
    declare id: string;
    declare userId: string;
        static associate() {
            wishLists.belongsTo(Users, { foreignKey: "userId", as: "buyer" });
            wishLists.hasMany(wishListProducts, { foreignKey: "wishListId", as: "wishListProducts" });
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

