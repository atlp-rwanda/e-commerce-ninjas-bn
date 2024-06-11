/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../config/db.config";
import { chatsAttributes } from "../../types";

class Chats extends Model<chatsAttributes>
{
  declare id: string;
  declare userId: string;
  declare message: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;

  static associate(models: any) {
    Chats.belongsTo(models.Users, { foreignKey: "userId" ,as: "user" });
  }
}

Chats.init(
  {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
  },
  {
    sequelize: sequelizeConnection,
    tableName: "chats",
    timestamps: true,
    modelName: "Chats"
  }
);

export default Chats;
