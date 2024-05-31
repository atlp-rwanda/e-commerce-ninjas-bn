/* eslint-disable require-jsdoc */
import { Model, DataTypes, Sequelize } from "sequelize";

interface TokenAttributes {
  id: number;
  userId: number;
  device: string;
  accessToken: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

module.exports = (sequelize: Sequelize) => {
  class Tokens extends Model<TokenAttributes> implements TokenAttributes {
    declare id: number;
    declare userId: number;
    declare device: string;
    declare accessToken: string;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare expiresAt: Date;
  }

  Tokens.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userId: {
        type: new DataTypes.INTEGER(),
        allowNull: false
      },
      device: {
        type: new DataTypes.STRING(280),
        allowNull: false
      },
      accessToken: {
        type: new DataTypes.STRING(280),
        allowNull: false
      },
      createdAt: {
        field: "createdAt",
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        field: "updatedAt",
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "tokens",
      timestamps: true,
      modelName: "Tokens"
    }
  );

  return Tokens;
};
