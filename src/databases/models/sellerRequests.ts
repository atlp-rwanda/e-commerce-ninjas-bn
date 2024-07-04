/* eslint-disable quotes */
/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
import { Model, DataTypes, Optional } from "sequelize";
import sequelizeConnection from "../config/db.config";
import Users from "./users";

export interface SellerRequestAttributes {
  id: string;
  userId: string;
  requestStatus: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SellerRequestCreationAttributes extends Optional<SellerRequestAttributes, "id"> {}

class SellerRequest extends Model<SellerRequestAttributes, SellerRequestCreationAttributes> implements SellerRequestAttributes {
  declare id: string;
  declare userId: string;
  declare requestStatus: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;

  static associate() {
    SellerRequest.belongsTo(Users, { foreignKey: "userId", as: "user" });
  }
}

SellerRequest.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    requestStatus: {
      type: DataTypes.STRING(128),
      allowNull: false,
      defaultValue: "Pending",
    },
    createdAt: {
      field: "createdAt",
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      field: "updatedAt",
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "seller_requests",
    timestamps: true,
    modelName: "SellerRequest",
  }
);

export default SellerRequest;
