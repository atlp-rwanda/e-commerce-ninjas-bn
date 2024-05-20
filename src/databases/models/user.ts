import { DataTypes, Model } from "sequelize";
import { SequelizeConnection } from "./index";

export default class User extends Model {
  declare id: number;

  declare firstName: string;

  declare lastName: string;

  declare email: string;

  declare createdAt: Date;

  declare updatedAt: Date;
}

const sequelizeConnection = SequelizeConnection.getInstance();

User.init(
  {
    id: {
      field: "id",
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    firstName: {
      field: "firstName",
      type: DataTypes.STRING,
    },
    lastName: {
      field: "lastName",
      type: DataTypes.STRING,
    },

    email: {
      field: "email",
      type: DataTypes.STRING,
    },
    createdAt: {
      field: "createdAt",
      type: DataTypes.DATE,
    },
    updatedAt: {
      field: "updatedAt",
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "users",
    modelName: "User",
  }
);

User.sync().then();
