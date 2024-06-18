/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../config/db.config";
import Products from "./products";
import Users from "./users";

export interface ProductReviewAttributes {
    id: string;
    productId: string;
    userId: string;
    feedback: string;
    rating: number;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

class ProductReviews extends Model<ProductReviewAttributes> implements ProductReviewAttributes {
    declare id: string;
    declare productId: string;
    declare userId: string;
    declare feedback: string;
    declare rating: number;
    declare status: boolean;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        ProductReviews.belongsTo(Products, { foreignKey: "productId", as: "product" });
        ProductReviews.belongsTo(Users, { foreignKey: "userId", as: "user" });
    }
}

ProductReviews.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
          },
        productId: {
            type: new DataTypes.UUID,
            allowNull: false
        },
        userId: {
            type: new DataTypes.UUID,
            allowNull: false
        },
        feedback: {
            type: new DataTypes.STRING,
            allowNull: true
        },
        rating: {
            type: new DataTypes.INTEGER,
            allowNull: true
        },
        status: {
            type: new DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
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
        }
    },
    {
        sequelize: sequelizeConnection,
        tableName: "productReviews",
        timestamps: true,
        modelName: "ProductReview"
    }
);

export default ProductReviews;