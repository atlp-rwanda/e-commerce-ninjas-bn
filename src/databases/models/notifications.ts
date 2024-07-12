/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../config/db.config";
import Users from "./users";
import { INotifications } from "../../types";

class Notifications extends Model<INotifications> {
  declare id: string;
  declare userId: string;
  declare message: string;
  declare isRead: boolean;

  static associate() {
      Notifications.belongsTo(Users, { foreignKey: "userId", as: "user" });
  }
}

Notifications.init(
  {
      id: {
          type: DataTypes.UUID,
          autoIncrement: true,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4
      },
      userId: {
          allowNull: false,
          type: DataTypes.UUID,
          references: {
              model: "users",
              key: "id"
          },
          onDelete: "CASCADE"
      },
      message: {
          allowNull: false,
          type: DataTypes.TEXT
      },
      isRead: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
      }
  },
  {
      sequelize: sequelizeConnection,
      tableName: "notifications",
      modelName: "Notifications",
      timestamps: true
  }
);

export default Notifications;