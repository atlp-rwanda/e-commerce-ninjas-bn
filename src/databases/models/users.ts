import { Model, DataTypes, Sequelize } from "sequelize";
import bcrypt from "bcrypt";

export interface UsersAttributes {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: number;
    profilePicture: string;
    gender: string;
    birthDate: string;
    language: string;
    currency: string;
    role: string;
    isVerified: boolean;
    is2FAEnabled: boolean;
    status: boolean;
    resetPasswordToken?: string;  
    resetPasswordExpires?: Date;  
    lastPasswordChange?: Date; 
    createdAt: Date;
    updatedAt: Date;    
}

module.exports = (sequelize: Sequelize) => {
    // eslint-disable-next-line require-jsdoc
    class Users extends Model<UsersAttributes> implements UsersAttributes {
        declare id: number;
        declare firstName: string;
        declare lastName: string;
        declare email: string;
        declare phone: number;
        declare profilePicture: string;
        declare gender: string;
        declare birthDate: string;
        declare language: string;
        declare currency: string;
        declare role: string;
        declare isVerified: boolean;
        declare is2FAEnabled: boolean;
        declare status: boolean;
        declare password: string;
        declare resetPasswordToken?: string;  
        declare resetPasswordExpires?: Date; 
        declare lastPasswordChange?: Date; 
        declare createdAt: Date;
        declare updatedAt: Date;

    }

    Users.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            firstName: {
                type: new DataTypes.STRING(128),
                allowNull: false
            },
            lastName: {
                type: new DataTypes.STRING(128),
                allowNull: false
            },
            email: {
                type: new DataTypes.STRING(128),
                allowNull: false
            },
            password: {
                type: new DataTypes.STRING(128),
                allowNull: false,
                defaultValue: "url"
            },
            phone: {
                type: new DataTypes.BIGINT,
                allowNull: false
            },
            profilePicture: {
                type: new DataTypes.STRING,
                allowNull: false,
                defaultValue: "https://upload.wikimedia.org/wikipedia/commons/5/59/User-avatar.svg"
            },
            gender: {
                type: new DataTypes.ENUM("male", "female"),
                allowNull: false
            },
            birthDate: {
                type: new DataTypes.DATEONLY,
                allowNull: false
            },
            language: {
                type: new DataTypes.STRING(128),
                allowNull: false
            },
            currency: {
                type: new DataTypes.STRING(128),
                allowNull: false
            },
            role: {
                type: new DataTypes.STRING(128),
                allowNull: false
            },
            isVerified: {
                type: new DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            is2FAEnabled: {
                type: new DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            status: {
                type: new DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            resetPasswordToken: {  
                type: DataTypes.STRING,
                allowNull: true
            },
            resetPasswordExpires: {  
                type: DataTypes.DATE,
                allowNull: true
            },
            lastPasswordChange: { 
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
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
            sequelize,
            tableName: "users",
            timestamps: true,
            modelName: "Users",
            hooks: {
                beforeCreate: async (user) => {
                    user.password = await bcrypt.hash(user.password, 10);
                }
            }
        }
    );

    return Users;
};
