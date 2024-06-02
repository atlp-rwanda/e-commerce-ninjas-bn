/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
import { Model, DataTypes, Sequelize } from "sequelize";
import sequelizeConnection from "../config/db.config";
import { IProduct } from "../../types";

class Products extends Model<IProduct> {
  declare id: number;
  declare collectionId: number;
  declare sellerId: number;
  declare name?: string;
  declare description?: string;
  declare price?: number;
  declare discount?: string;
  declare category?: string;
  declare expiryDate?: Date;
  declare expired?: boolean;
  declare bonus?: string;
  declare images?: string[];
  declare quantity?: number;
  declare isAvailable?: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  static associate(models: any) {
    Products.belongsTo(models.Users, { foreignKey: "sellerId", as: "seller" });
    Products.belongsTo(models.Collection, {
      foreignKey: "collectionId",
      as: "collection",
    });
  }
}

Products.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      defaultValue: DataTypes.UUIDV4,
    },
    collectionId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "collection",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    sellerId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      allowNull: false,
      type: DataTypes.DECIMAL(10, 2),
    },
    discount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    expiryDate: {
      type: DataTypes.DATE,
    },
    expired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    bonus: {
      type: DataTypes.STRING,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    quantity: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isAvailable: {
      type: DataTypes.STRING(128),
      allowNull: false,
      defaultValue: "available",
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "Products",
    modelName: "Products",
    timestamps: true,
  }
);

export default Products;
