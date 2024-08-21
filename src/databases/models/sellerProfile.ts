/* eslint-disable quotes */
/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../config/db.config";
import Users from "./users";
import Shops from "./shops";
import PaymentMethods from "./paymentMethods";

export interface SellerProfileAttributes {
  id: string;
  userId: string;
  requestStatus: string;
  shopsId: string;
  paymentMethodId: string;
  businessName: string;
  tin: number;
  rdbDocument:string;
  terms:boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
class SellerProfile extends Model<SellerProfileAttributes> implements SellerProfileAttributes {
  declare id: string;
  declare userId: string;
  declare shopsId: string;
  declare paymentMethodId: string;
  declare businessName: string;
  declare tin: number;
  declare rdbDocument: string;
  declare terms: boolean;
  declare requestStatus: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
  user: any;

  static associate() {
    SellerProfile.belongsTo(Users, { foreignKey: "userId", as: "user" ,onDelete: "CASCADE"});
    SellerProfile.belongsTo(Shops, { foreignKey: "shopsId", as: "shop",onDelete: "CASCADE" });
    SellerProfile.belongsTo(PaymentMethods, { foreignKey: "paymentMethodId", as: "paymentMethods" ,onDelete: "CASCADE"});
  }
}


SellerProfile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    shopsId: {
      allowNull: false,
            type: DataTypes.UUID,
            references: {
                model: "Shops",
                key: "id"
            },
            onDelete: "CASCADE"
    },
    paymentMethodId:{
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "PaymentMethods",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    },
    businessName: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    tin: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rdbDocument:{
      type:  DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    terms:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    requestStatus: {
      type: DataTypes.STRING(128),
      allowNull: false,
      defaultValue: "Pending",
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
    tableName: "sellerProfiles",
    timestamps: true,
    modelName: "SellerProfile",
  }
);

export default SellerProfile;
