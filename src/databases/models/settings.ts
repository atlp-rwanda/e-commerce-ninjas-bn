/* eslint-disable */
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../config/db.config";

export interface SettingsAttributes {
  id: string;
  key: string;
  value: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Settings extends Model<SettingsAttributes> implements SettingsAttributes {
  declare id: string;
  declare key: string;
  declare value: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;

  static associate(models: any) {
  }
}

Settings.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.STRING(255),
      allowNull: false,
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
    tableName: "settings",
    timestamps: true,
    modelName: "Settings",
  }
);

export default Settings;
