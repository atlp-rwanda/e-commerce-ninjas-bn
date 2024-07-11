/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
import { Model, DataTypes, Sequelize } from "sequelize";
import sequelizeConnection from "../config/db.config";
import Shop from "./shops";
import CartProducts from "./cartProducts";
import { IProduct } from "../../types";
import ProductReviews from "./productReviews";

class Products extends Model<IProduct> {
  declare id: string;
  declare shopId: string;
  declare name: string;
  declare description?: string;
  declare price: number;
  declare discount?: string;
  declare category: string;
  declare expiryDate?: Date;
  declare expired: boolean;
  declare bonus?: string;
  declare images: string[];
  declare quantity: number;
  declare status: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  static associate() {
    Products.belongsTo(Shop, { foreignKey: "shopId", as: "shops" });
    Products.hasMany(CartProducts, { foreignKey: "productId", as: "cartProducts" });
    Products.hasMany(ProductReviews, { foreignKey: "productId", as: "productReviews" });
  }
}

Products.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: true,
      defaultValue: DataTypes.UUIDV4,
    },
    shopId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: "Shops",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
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
    status: {
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
    tableName: "products",
    modelName: "Products",
    timestamps: true,
  }
);

export default Products;