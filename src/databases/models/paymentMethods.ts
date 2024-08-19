/* eslint-disable */
import { Model, DataTypes, Optional } from "sequelize";
import sequelizeConnection from "../config/db.config";
import Users from "./users";
import SellerProfile from "./sellerProfile";

interface IPaymentMethods {
  id: string;
  userId: string;
  bankPayment: boolean;
  mobilePayment: boolean;
  bankAccount: string;
  bankName: string;
  mobileNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
}
class PaymentMethods extends Model<IPaymentMethods> implements IPaymentMethods {
  declare id: string;
  declare userId: string;
  declare bankPayment: boolean;
  declare mobilePayment: boolean;
  declare bankAccount: string;
  declare bankName: string;
  declare mobileNumber: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;

  static associate() {
    PaymentMethods.belongsTo(Users, { foreignKey: "userId", as: "user",onDelete: "CASCADE" });
    PaymentMethods.hasMany(SellerProfile, { foreignKey: "paymentMethodId", as: "SellerProfile", onDelete: "CASCADE"});
  }
  
}
PaymentMethods.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    bankPayment: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    mobilePayment: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull:true,
    },
    bankAccount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bankName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    }
  },
  {
    sequelize: sequelizeConnection,
    tableName: "paymentMethods",
    timestamps: true,
    modelName: "PaymentMethods",
  }
);

export default PaymentMethods;