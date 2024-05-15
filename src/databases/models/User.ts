import { DataTypes } from "sequelize";
import sequelize from "../config/database";

export const User = sequelize.define(
  'User',
  {
    names: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
  }
);