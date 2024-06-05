/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
import { Model, DataTypes, Optional } from "sequelize";
import sequelizeConnection from "../config/db.config";
import bcrypt from "bcrypt";
export interface UsersAttributes {
    id: number;
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    phone?: number;
    profilePicture?: string;
    gender?: string;
    birthDate?: string;
    language?: string;
    currency?: string;
    role?: string;
    isVerified?: boolean;
    isGoogleAccount?: boolean;
    is2FAEnabled?: boolean;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface UsersCreationAttributes
    extends Optional<UsersAttributes, "id"> { }

class Users
    extends Model<UsersAttributes, UsersCreationAttributes>
    implements UsersAttributes {
    declare id: number;
    declare firstName?: string;
    declare lastName?: string;
    declare email: string;
    declare phone?: number;
    declare profilePicture?: string;
    declare gender?: string;
    declare birthDate?: string;
    declare language?: string;
    declare currency?: string;
    declare role?: string;
    declare isVerified?: boolean;
    declare isGoogleAccount?: boolean;
    declare is2FAEnabled?: boolean;
    declare status?: string;
    declare password: string;
    declare createdAt?: Date;
    declare updatedAt?: Date;

    static associate(models: any) {
        Users.hasOne(models.Tokens, { foreignKey: "userId", as: "token" });
    }
}

Users.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    firstName: {
      type: new DataTypes.STRING(128),
      allowNull: true
    },
    lastName: {
      type: new DataTypes.STRING(128),
      allowNull: true
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: new DataTypes.STRING(255),
      allowNull: false
    },
    phone: {
      type: new DataTypes.BIGINT(),
      allowNull: true
    },
    profilePicture: {
      type: new DataTypes.STRING(128),
      allowNull: true,
      defaultValue:
        "https://upload.wikimedia.org/wikipedia/commons/5/59/User-avatar.svg"
    },
    gender: {
      type: new DataTypes.ENUM("male", "female"),
      allowNull: true
    },
    birthDate: {
      type: new DataTypes.DATEONLY(),
      allowNull: true
    },
    language: {
      type: new DataTypes.STRING(128),
      allowNull: true
    },
    currency: {
      type: new DataTypes.STRING(128),
      allowNull: true
    },
    role: {
      type: new DataTypes.STRING(128),
      allowNull: true
    },
    isVerified: {
      type: new DataTypes.BOOLEAN(),
      allowNull: true,
      defaultValue: false
    },
    isGoogleAccount: {
      type: new DataTypes.BOOLEAN(),
      allowNull: true,
      defaultValue: false
    },
    is2FAEnabled: {
      type: new DataTypes.BOOLEAN(),
      allowNull: true,
      defaultValue: false
    },
    status: {
      type: new DataTypes.STRING(128),
      allowNull: true,
      defaultValue: "enabled"
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
    tableName: "users",
    timestamps: true,
    modelName: "Users",
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  }
);

export default Users;
